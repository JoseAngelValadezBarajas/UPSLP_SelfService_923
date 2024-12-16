// --------------------------------------------------------------------
// <copyright file="RoleAuthorizeAttribute.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Navigation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using SelfService.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace SelfService.Filters
{
    /// <summary>
    /// Custom attribute to validate role authorization.
    /// Requires the SiteMap Session, the SessionExpiredAttribute filter should be executed before to load the session.
    /// </summary>
    /// <seealso cref="SessionExpiredAttribute" />
    /// <seealso cref="Attribute" />
    /// <seealso cref="IAuthorizationFilter" />
    [AttributeUsage(AttributeTargets.Method)]
    public class RoleAuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        #region Private Fields

        /// <summary>
        /// The anonymous controllers
        /// </summary>
        private readonly List<string> _anonymousControllers = new() { "Admissions", "ContinuingEducation", "MakeGift", "Planning", "Search" };

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The links
        /// </summary>
        private readonly List<string> _links;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<RoleAuthorizeAttribute> _logger;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="RoleAuthorizeAttribute"/> class.
        /// </summary>
        /// <param name="links">The links.</param>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="logger">The logger.</param>
        public RoleAuthorizeAttribute(
            string[] links,
            IInstitutionSettingService institutionSettingService,
            IAppLogger<RoleAuthorizeAttribute> logger) : base()
        {
            _links = new List<string>(links);

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
                SiteMap sitemap = context.HttpContext.Session.GetObject<SiteMap>(Constants._siteMapSession);
                context.HttpContext.Items[Constants._currentLinkIdSession] = Convert.ToBase64String(Encoding.ASCII.GetBytes(_links[0]));
                if (sitemap != null && sitemap.Options != null && sitemap.OptionsDetail != null
                    && (_links.Intersect(sitemap.Options.Select(s => s.LinkId)).Any()
                    || _links.Intersect(sitemap.OptionsDetail.Select(s => s.LinkId)).Any()))
                {
                    return;
                }

                InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
                if (logging.EnablePermissionEvaluationFailure)
                {
                    Claim userGuidClaim = context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                    _logger.LogPermissionEvaluation(Constants._product,
                        $"{Constants._permissionEvaluationFailed} (Missing requirement(s): {string.Join(", ", _links)})",
                        success: false,
                        userGuidClaim?.Value != null ? Guid.Parse(userGuidClaim.Value) : null,
                        logging.IncludeClientIp ? _logger.GetIpAddress(context.HttpContext) : null,
                        logging.IncludePrincipalId ? context.HttpContext.User.Identity?.Name : null);
                }
                else
                {
                    _logger.LogError(Constants._product, typeof(RoleAuthorizeAttribute).FullName, Constants._permissionEvaluationFailed);
                }

                if (!context.HttpContext.User.Identity.IsAuthenticated
                    && context.HttpContext.GetRouteData()?.Values["controller"] != null
                    && _anonymousControllers.Contains(context.HttpContext.GetRouteData().Values["controller"].ToString()))
                {
                    context.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Home", action = "Index" }));
                    return;
                }

                context.HttpContext.Response.StatusCode = 403;
                context.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Errors", action = "Error403" }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RoleAuthorizeAttribute).FullName, exception.Message, exception);
                context.Result = new RedirectToRouteResult(new
                               RouteValueDictionary(new { controller = "Errors", action = "Error500", area = "" }));
            }
        }
    }
}