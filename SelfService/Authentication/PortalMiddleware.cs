// --------------------------------------------------------------------
// <copyright file="PortalMiddleware.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Logic;
using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Administration.Models.Enum;
using Hedtech.PowerCampus.Administration.Models.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SelfService.Authentication
{
    /// <summary>
    /// PortalMiddlewareExtensions
    /// </summary>
    public static class PortalMiddlewareExtensions
    {
        /// <summary>
        /// Uses the portal authentication.
        /// </summary>
        /// <param name="app">The application.</param>
        /// <returns></returns>
        public static IApplicationBuilder UsePortalAuthentication(this IApplicationBuilder app) => app.UseMiddleware<PortalMiddleware>();
    }

    /// <summary>
    /// PortalMiddleware
    /// </summary>
    public class PortalMiddleware
    {
        #region Private Fields

        /// <summary>
        /// The next
        /// </summary>
        private readonly RequestDelegate _next;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="PortalMiddleware" /> class.
        /// </summary>
        /// <param name="next">The next.</param>
        public PortalMiddleware(RequestDelegate next) => _next = next;

        /// <summary>
        /// Invokes the specified context.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="loginSettings">The login settings.</param>
        /// <param name="activeDirectoryStoreSettings">The active directory store settings.</param>
        /// <param name="signInManager">The sign in manager.</param>
        /// <param name="appStoreService">The application store service.</param>
        /// <param name="appUserService">The application user service.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="ssoService">The sso service.</param>
        /// <param name="logger">The logger.</param>
        /// <returns></returns>
        public Task Invoke(HttpContext context,
            IOptions<LoginSettings> loginSettings,
            IOptions<List<ActiveDirectoryStoreSettings>> activeDirectoryStoreSettings,
            CustomSignInManager signInManager,
            IAppStoreService appStoreService,
            IAppUserService appUserService,
            ISettingHelper settingHelper,
            ISsoService ssoService,
            IAppLogger<PortalMiddleware> logger)
        {
            try
            {
                if (loginSettings.Value.EnablePortalSSO)
                {
                    int applicationId = settingHelper.GetApplicationId();
                    string ticket = context.Request.Query["ticket"];
                    string whiteList = loginSettings.Value.PortalSSOWhiteList;
                    string[] whiteListUrls = whiteList.Split(',');
                    string currentReferer = context.Request.Headers["Referer"];
                    if (!string.IsNullOrEmpty(ticket)
                        && !string.IsNullOrEmpty(currentReferer)
                        && whiteListUrls.Any(wl => !string.IsNullOrEmpty(wl) && currentReferer.StartsWith(wl)))
                    {
                        bool performSso = false;
                        AppUser appUser = null;
                        string userName = ssoService.GetUserName(ticket, Constants._portalApplicationId);
                        if (!string.IsNullOrEmpty(userName))
                        {
                            appUser = appUserService.GetByApplication(applicationId, userName);

                            if (context.User.Identity.IsAuthenticated && context.User.Identity.Name.ToLower() != userName.ToLower())
                            {
                                context.Response.Redirect(context.Request.PathBase.Value + "/Home/SignOutRedirection?redirectLocation=" + SignOutRedirectLocation.Default);
                                return Task.CompletedTask;
                            }
                            else if (!context.User.Identity.IsAuthenticated && appUser.AuthenticationAppStoreId.HasValue)
                            {
                                AppStore appStore = appStoreService.GetStoreById(appUser.AuthenticationAppStoreId.Value);
                                if (appStore.Mode == (int)StoreMode.ActiveDirectory)
                                    appUser = appUserService.GetUserAD(appUser, activeDirectoryStoreSettings.Value);
                                performSso = (appStore?.Mode == (int)StoreMode.Identity || appStore?.Mode == (int)StoreMode.ActiveDirectory)
                                    && !appUser.LockoutEnabled && !appUser.ChangePasswordAtNextLogon;
                            }
                        }

                        if (performSso)
                            signInManager.SignInAsync(appUser, false);
                    }
                    string newQueryString = Regex.Replace(context.Request.QueryString.Value, @"(&)?(" + $"ticket={Regex.Escape(ticket)}" + @")(&)?", string.Empty);
                    string queryStringPart = string.IsNullOrEmpty(newQueryString) ? string.Empty : $"?{newQueryString}";
                    context.Response.Redirect($"{context.Request.Path}{queryStringPart}");
                }
                else
                {
                    context.Response.Redirect($"{context.Request.Path}{context.Request.QueryString}");
                }
            }
            catch (Exception exception)
            {
                logger.LogError(Constants._product, typeof(PortalMiddleware).FullName, exception.Message, exception);
                context.Response.Redirect($"{context.Request.PathBase}/Errors/Error500");
            }
            return Task.CompletedTask;
        }
    }
}