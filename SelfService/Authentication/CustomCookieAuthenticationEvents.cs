// --------------------------------------------------------------------
// <copyright file="CustomCookieAuthenticationEvents.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using SelfService.Helpers.Interfaces;
using System;
using System.Threading.Tasks;

namespace SelfService.Authentication
{
    /// <summary>
    /// CustomCookieAuthenticationEvents
    /// </summary>
    /// <seealso cref="CookieAuthenticationEvents" />
    public class CustomCookieAuthenticationEvents : CookieAuthenticationEvents
    {
        #region Private Fields

        /// <summary>
        /// The application store service
        /// </summary>
        private readonly IAppStoreService _appStoreService;

        /// <summary>
        /// The application user service
        /// </summary>
        private readonly IAppUserService _appUserService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<CustomCookieAuthenticationEvents> _logger;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="CustomCookieAuthenticationEvents"/> class.
        /// </summary>
        /// <param name="appStoreService">The application store service.<seealso cref="IAppStoreService"/></param>
        /// <param name="appUserService">The application user service.<seealso cref="IAppUserService"/></param>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="settingHelper">The setting helper.<seealso cref="ISettingHelper"/></param>
        /// <param name="logger">The logger.<seealso cref="IAppLogger{CustomCookieAuthenticationEvents}"/></param>
        public CustomCookieAuthenticationEvents(
            IAppStoreService appStoreService,
            IAppUserService appUserService,
            IInstitutionSettingService institutionSettingService,
            ISettingHelper settingHelper,
            IAppLogger<CustomCookieAuthenticationEvents> logger)
        {
            _appStoreService = appStoreService;
            _appUserService = appUserService;
            _institutionSettingService = institutionSettingService;
            _settingHelper = settingHelper;

            _logger = logger;
        }

        /// <summary>
        /// Invoked when the client is being redirected to the access denied url.
        /// </summary>
        /// <param name="context">The <see cref="T:Microsoft.AspNetCore.Authentication.RedirectContext`1" />.</param>
        /// <returns></returns>
        public override Task RedirectToAccessDenied(RedirectContext<CookieAuthenticationOptions> context)
        {
            InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
            if (logging.EnablePermissionEvaluationFailure)
            {
                _logger.LogPermissionEvaluation(Constants._product,
                    $"{Constants._permissionEvaluationFailed} (AuthenticationRequired, Path: {context.Request.Path})",
                    success: false, userGuid: null,
                    logging.IncludeClientIp ? _logger.GetIpAddress(context.HttpContext) : null,
                    principalId: null);
            }
            return base.RedirectToAccessDenied(context);
        }

        /// <summary>
        /// Invoked when the client is being redirected to the log in url.
        /// </summary>
        /// <param name="context">The <see cref="T:Microsoft.AspNetCore.Authentication.RedirectContext`1" />.</param>
        /// <returns></returns>
        public override Task RedirectToLogin(RedirectContext<CookieAuthenticationOptions> context)
        {
            InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
            if (logging.EnablePermissionEvaluationFailure && context.Request.Path.ToString() is not "" and not "/")
            {
                _logger.LogPermissionEvaluation(Constants._product,
                    $"{Constants._permissionEvaluationFailed} (AuthenticationRequired, Path: {context.Request.Path})",
                    success: false, userGuid: null,
                    logging.IncludeClientIp ? _logger.GetIpAddress(context.HttpContext) : null,
                    principalId: null);
            }
            return base.RedirectToLogin(context);
        }

        /// <summary>
        /// Invoked during sign in.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task SigningIn(CookieSigningInContext context)
        {
            int applicationId = _settingHelper.GetApplicationId();
            int sessionTimeoutMinutes = -1;
            AppUser appUser = null;
            try
            {
                appUser = _appUserService.GetByApplication(applicationId, context.Principal.Identity.Name);
                if (appUser?.CreationAppStoreId != null)
                {
                    AppStore appStore = _appStoreService.GetStoreById(appUser.AuthenticationAppStoreId.Value);
                    if (appStore != null)
                        sessionTimeoutMinutes = appStore.SessionTimeoutMinutes;
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(Startup).FullName, exception.Message, exception);
            }
            finally
            {
                if (sessionTimeoutMinutes <= 0)
                    sessionTimeoutMinutes = Constants._defaultCookieTimeout;
                context.Properties.AllowRefresh = true;
                context.Properties.ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(sessionTimeoutMinutes);
                context.Properties.IsPersistent = false;

                InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
                if (logging.EnableLoginLogout)
                {
                    _logger.LogLogin(Constants._product, Constants._loginAttempt, success: true, appUser?.UserGuid,
                        logging.IncludeClientIp ? _logger.GetIpAddress(context.HttpContext) : null,
                        logging.IncludePrincipalId ? appUser?.UserName : null);
                }
            }
            return Task.CompletedTask;
        }
    }
}