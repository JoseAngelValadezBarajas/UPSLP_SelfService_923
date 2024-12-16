// --------------------------------------------------------------------
// <copyright file="SessionExpiredAttribute.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Navigation;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Session;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using TemporaryUser = Hedtech.PowerCampus.Core.DTO.Foundation.TemporaryUser;

namespace SelfService.Filters
{
    /// <summary>
    /// Custom filter to validate if the session has expired.
    /// To send parameters use Arguments, it is an array of objects.
    /// The first boolean means loadAccount.
    /// The second boolean means loadSiteMap.
    /// To load both (Account and SiteMap Sessions), do not send anything in the arguments, the default value for both is true.
    /// To load only the Account Session: Arguments = new object[] { true, false }
    /// To load only the SiteMap Session: Arguments = new object[] { false, true }
    /// </summary>
    /// <seealso cref="Attribute" />
    /// <seealso cref="IAuthorizationFilter" />
    [AttributeUsage(AttributeTargets.Class)]
    public class SessionExpiredAttribute : Attribute, IAuthorizationFilter
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
        /// The load account
        /// </summary>
        private readonly bool _loadAccount;

        /// <summary>
        /// The load site map
        /// </summary>
        private readonly bool _loadSiteMap;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<SessionExpiredAttribute> _logger;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// The site map service
        /// </summary>
        private readonly ISiteMapService _siteMapService;

        /// <summary>
        /// The temporary user service
        /// </summary>
        private readonly ITemporaryUserService _temporaryUserService;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="SessionExpiredAttribute"/> class.
        /// </summary>
        /// <param name="appStoreService">The application store service.</param>
        /// <param name="appUserService">The application user service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="siteMapService">The site map service.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="logger">The logger.</param>
        /// <param name="loadAccount">if set to <c>true</c> [load account].</param>
        /// <param name="loadSiteMap">if set to <c>true</c> [load site map].</param>
        public SessionExpiredAttribute(
            IAppStoreService appStoreService,
            IAppUserService appUserService,
            IInstitutionSettingService institutionSettingService,
            IPeopleService peopleService,
            ISettingHelper settingHelper,
            ISiteMapService siteMapService,
            ITemporaryUserService temporaryUserService,
            IAppLogger<SessionExpiredAttribute> logger,
            bool loadAccount = true,
            bool loadSiteMap = true) : base()
        {
            _appStoreService = appStoreService;
            _appUserService = appUserService;
            _institutionSettingService = institutionSettingService;
            _peopleService = peopleService;
            _settingHelper = settingHelper;
            _siteMapService = siteMapService;
            _temporaryUserService = temporaryUserService;

            _loadAccount = loadAccount;
            _loadSiteMap = loadSiteMap;

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
                if (context.HttpContext.User.Identity.IsAuthenticated)
                {
                    #region Account

                    if (_loadAccount)
                    {
                        Account account = context.HttpContext.Session.GetObject<Account>(Constants._accountSession);
                        if (account is null)
                        {
                            IEnumerable<Claim> claims = ((ClaimsIdentity)context.HttpContext.User.Identity).Claims;
                            Claim claimName = claims.FirstOrDefault(c => string.Equals(c.Type, ClaimsIdentity.DefaultNameClaimType));

                            int applicationId = _settingHelper.GetApplicationId();
                            int authenticationMode = 0;
                            int sessionTimeoutMinutes = -1;
                            AppUser appUser = _appUserService.GetByApplication(applicationId, claimName.Value);

                            if (appUser.CreationAppStoreId != null)
                            {
                                AppStore creationStore = _appStoreService.GetStoreById(appUser.AuthenticationAppStoreId.Value);
                                if (creationStore != null)
                                    sessionTimeoutMinutes = creationStore.SessionTimeoutMinutes;
                            }
                            if (sessionTimeoutMinutes <= 0)
                                sessionTimeoutMinutes = Constants._defaultCookieTimeout;

                            if (appUser.AuthenticationAppStoreId != null)
                            {
                                AppStore authenticationStore = _appStoreService.GetStoreById(appUser.AuthenticationAppStoreId.Value);
                                if (authenticationStore != null)
                                    authenticationMode = authenticationStore.Mode;
                            }

                            int personId = _peopleService.GetPersonId(claimName.Value);
                            People people = null;
                            TemporaryUser temporaryUser = null;
                            if (personId > 0)
                                people = _peopleService.Get(personId);
                            else
                                temporaryUser = _temporaryUserService.Get(claimName.Value);
                            account = new()
                            {
                                AuthenticationMode = authenticationMode,
                                DisplayName = people?.DisplayName ?? temporaryUser?.FirstName ?? string.Empty,
                                Email = people?.Email ?? temporaryUser?.Email ?? string.Empty,
                                PeopleCodeId = people?.PeopleCodeId ?? string.Empty,
                                PeopleId = people?.PeopleId ?? string.Empty,
                                PersonId = personId,
                                SessionTimeoutMinutes = sessionTimeoutMinutes,
                                TemporaryEmail = temporaryUser?.Email ?? string.Empty,
                                TemporaryUserId = temporaryUser?.Id ?? -1,
                                UserName = claimName.Value
                            };
                        }
                        account.Language = _institutionSettingService.GetGeneral().UICulture;
                        context.HttpContext.Session.SetObject(Constants._accountSession, account);
                    }

                    #endregion Account

                    #region Site Map

                    if (_loadSiteMap)
                    {
                        if (context.HttpContext.Session.GetObject<SiteMap>(Constants._siteMapAuthenticatedSession) is null)
                        {
                            string[] roles = ((ClaimsIdentity)context.HttpContext.User.Identity).Claims
                                    .Where(c => c.Type == ClaimsIdentity.DefaultRoleClaimType)
                                    .Select(c => c.Value).ToArray();

                            context.HttpContext.Session.SetObject(Constants._siteMapAuthenticatedSession, _siteMapService.GetOptions(roles));
                        }
                        context.HttpContext.Session.SetObject(Constants._siteMapSession,
                            context.HttpContext.Session.GetObject<SiteMap>(Constants._siteMapAuthenticatedSession));
                    }

                    #endregion Site Map
                }
                else
                {
                    #region Site Map

                    if (_loadSiteMap)
                    {
                        context.HttpContext.Session.SetObject(Constants._siteMapSession,
                            _siteMapService.GetOptions(Constants._anonymousRole));
                    }

                    #endregion Site Map
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SessionExpiredAttribute).FullName, exception.Message, exception);
                context.Result = new RedirectToRouteResult(new
                               RouteValueDictionary(new { controller = "Errors", action = "Error500", area = "" }));
            }
        }
    }
}