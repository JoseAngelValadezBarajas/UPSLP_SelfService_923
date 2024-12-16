// --------------------------------------------------------------------
// <copyright file="NoDirectAccessAttribute.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace SelfService.Filters
{
    /// <summary>
    /// Custom filter to avoid the direct access to the endpoints.
    /// </summary>
    /// <seealso cref="Attribute" />
    /// <seealso cref="IAuthorizationFilter" />
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class NoDirectAccessAttribute : Attribute, IAuthorizationFilter
    {
        #region Private Fields

        /// <summary>
        /// The list of actions allowed
        /// </summary>
        private readonly List<string> _actionsAllowed;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<NoDirectAccessAttribute> _logger;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="NoDirectAccessAttribute"/> class.
        /// </summary>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="logger">The logger.</param>
        /// <param name="actionsAllowed">Actions allowed.</param>
        public NoDirectAccessAttribute(
            IInstitutionSettingService institutionSettingService,
            IAppLogger<NoDirectAccessAttribute> logger,
            string[] actionsAllowed = null)
            : base()
        {
            if (actionsAllowed != null)
                _actionsAllowed = new List<string>(actionsAllowed);

            _institutionSettingService = institutionSettingService;

            _logger = logger;
        }

        /// <summary>
        /// Called early in the filter pipeline to confirm request is authorized.
        /// </summary>
        /// <param name="context">The <see cref="T:Microsoft.AspNetCore.Mvc.Filters.AuthorizationFilterContext" />.</param>
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                if (_actionsAllowed != null && _actionsAllowed.Contains(context.HttpContext.GetRouteData()?.Values["action"].ToString()))
                    return;

                bool canAcess = false;
                string referer = context.HttpContext.Request.Headers["Referer"].ToString();
                if (!string.IsNullOrEmpty(referer))
                {
                    Uri rUri = new UriBuilder(referer).Uri;
                    HttpRequest req = context.HttpContext.Request;
                    if (req.Host.Host == rUri.Host)
                    {
                        canAcess = true;
                    }
                    else
                    {
                        _logger.LogError(Constants._product, typeof(NoDirectAccessAttribute).FullName,
                            $"DirectAccessAttempt (Host.Host = {req.Host.Host}, Uri.Host = {rUri.Host})");
                    }
                }

                if (!canAcess)
                {
                    referer = string.IsNullOrEmpty(referer) ? "NoUrl" : referer;
                    _logger.LogError(Constants._product, typeof(NoDirectAccessAttribute).FullName, $"DirectAccessAttempt: {referer}");

                    InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
                    if (logging.EnablePermissionEvaluationFailure)
                    {
                        Claim userGuidClaim = context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                        _logger.LogPermissionEvaluation(Constants._product,
                            $"{Constants._permissionEvaluationFailed} (DirectAccessAttempt, Referer: {referer})",
                            success: false,
                            userGuidClaim?.Value != null ? Guid.Parse(userGuidClaim.Value) : null,
                            logging.IncludeClientIp ? _logger.GetIpAddress(context.HttpContext) : null,
                            logging.IncludePrincipalId ? context.HttpContext.User.Identity?.Name : null);
                    }
                    context.HttpContext.Response.StatusCode = 403;
                    context.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Errors", action = "Error403" }));
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NoDirectAccessAttribute).FullName, exception.Message, exception);
                context.Result = new RedirectToRouteResult(new
                               RouteValueDictionary(new { controller = "Errors", action = "Error500", area = "" }));
            }
        }
    }
}