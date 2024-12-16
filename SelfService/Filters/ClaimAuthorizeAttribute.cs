// --------------------------------------------------------------------
// <copyright file="ClaimAuthorizeAttribute.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
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
    /// Custom attribute to validate claim authorization.
    /// </summary>
    /// <seealso cref="Attribute" />
    /// <seealso cref="IAuthorizationFilter" />
    [AttributeUsage(AttributeTargets.Method)]
    public class ClaimAuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        #region Private Fields

        /// <summary>
        /// The claims
        /// </summary>
        private readonly List<string> _claims;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<ClaimAuthorizeAttribute> _logger;

        /// <summary>
        /// The optional
        /// </summary>
        private readonly bool _optional;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="ClaimAuthorizeAttribute"/> class.
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="logger">The logger.</param>
        /// <param name="optional">if set to <c>true</c> [optional].</param>
        public ClaimAuthorizeAttribute(
            string[] claims,
            IInstitutionSettingService institutionSettingService,
            IAppLogger<ClaimAuthorizeAttribute> logger,
            bool optional = false) : base()
        {
            _claims = new List<string>(claims);
            _optional = optional;

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
                // Since claims were not specified, access should be granted
                if (_claims == null || _claims.Count == 0) return;

                IEnumerable<string> claimTypes = context.HttpContext.User.Claims.Select(c => c.Type);
                Claim userGuidClaim = context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

                bool isAuthorized = _optional ? _claims.Intersect(claimTypes).Any() : _claims.Intersect(claimTypes).Count() == _claims.Count;
                if (!isAuthorized)
                {
                    InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
                    if (logging.EnablePermissionEvaluationFailure)
                    {
                        List<string> missingClaims = _claims.Except(claimTypes).ToList();
                        string detailedMessage = $"Missing{(_optional ? " optional" : string.Empty)} requirement(s): {string.Join(", ", missingClaims)}";

                        _logger.LogPermissionEvaluation(Constants._product,
                            $"{Constants._permissionEvaluationFailed} ({detailedMessage})",
                            success: false,
                            userGuidClaim?.Value != null ? Guid.Parse(userGuidClaim.Value) : null,
                            logging.IncludeClientIp ? _logger.GetIpAddress(context.HttpContext) : null,
                            logging.IncludePrincipalId ? context.HttpContext.User.Identity.Name : null);
                    }
                    else
                    {
                        _logger.LogError(Constants._product, typeof(ClaimAuthorizeAttribute).FullName, Constants._permissionEvaluationFailed);
                    }
                    context.HttpContext.Response.StatusCode = 403;
                    context.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Errors", action = "Error403" }));
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ClaimAuthorizeAttribute).FullName, exception.Message, exception);
                context.Result = new RedirectToRouteResult(new
                               RouteValueDictionary(new { controller = "Errors", action = "Error500", area = "" }));
            }
        }
    }
}