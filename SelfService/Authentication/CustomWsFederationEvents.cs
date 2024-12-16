// --------------------------------------------------------------------
// <copyright file="CustomWsFederationEvents.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Logic;
using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Administration.Models.Enum;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.WsFederation;
using Microsoft.AspNetCore.Http;
using SelfService.Helpers.Interfaces;
using System;
using System.Text;
using System.Threading.Tasks;

namespace SelfService.Authentication
{
    /// <summary>
    /// CustomWsFederationEvents
    /// </summary>
    /// <seealso cref="WsFederationEvents" />
    public class CustomWsFederationEvents : WsFederationEvents
    {
        #region Private Fields

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
        private readonly IAppLogger<CustomWsFederationEvents> _logger;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// The sign in manager
        /// </summary>
        private readonly CustomSignInManager _signInManager;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="CustomWsFederationEvents"/> class.
        /// </summary>
        /// <param name="signInManager">The sign in manager.</param>
        /// <param name="appUserService">The application user service.</param>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="logger">The logger.</param>
        public CustomWsFederationEvents(
            CustomSignInManager signInManager,
            IAppUserService appUserService,
            IInstitutionSettingService institutionSettingService,
            ISettingHelper settingHelper,
            IAppLogger<CustomWsFederationEvents> logger)
        {
            _signInManager = signInManager;

            _appUserService = appUserService;
            _institutionSettingService = institutionSettingService;
            _settingHelper = settingHelper;

            _logger = logger;
        }

        /// <summary>
        /// Invoked when an access denied error was returned by the remote server.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task AccessDenied(AccessDeniedContext context) => Task.CompletedTask;

        /// <summary>
        /// Invoked if exceptions are thrown during request processing. The exceptions will be re-thrown after this event unless suppressed.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task AuthenticationFailed(AuthenticationFailedContext context)
        {
            _logger.LogError(Constants._product, typeof(CustomWsFederationEvents).FullName, "AuthenticationFailed");

            InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
            if (logging.EnableLoginLogout)
            {
                _logger.LogLogin(Constants._product, $"{Constants._loginAttemptFailed} - {StoreMode.ADFS} (AuthenticationFailed)", success: false, userGuid: null,
                    logging.IncludeClientIp ? _logger.GetIpAddress(context.HttpContext) : null, principalId: null);
            }

            context.HandleResponse();
            context.Response.Redirect($"{context.Request.PathBase}/Errors/Error500");
            return Task.FromResult(0);
        }

        /// <summary>
        /// Invoked when a protocol message is first received.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task MessageReceived(MessageReceivedContext context) => Task.CompletedTask;

        /// <summary>
        /// Invoked to manipulate redirects to the identity provider for SignIn, SignOut, or Challenge.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task RedirectToIdentityProvider(RedirectContext context)
        {
            try
            {
                string userName = context.Request.Query["userName"];
                if (!string.IsNullOrEmpty(userName))
                    context.ProtocolMessage.Parameters.Add("username", userName);
                context.Response.Cookies.Delete(Constants._cookieScheme);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CustomWsFederationEvents).FullName, exception.Message, exception);
                context.Response.Redirect($"{context.Request.PathBase}/Errors/Error500");
            }
            return Task.CompletedTask;
        }

        /// <summary>
        /// Invoked when there is a remote failure.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task RemoteFailure(RemoteFailureContext context) => Task.CompletedTask;

        /// <summary>
        /// Invoked when a wsignoutcleanup request is received at the RemoteSignOutPath endpoint.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task RemoteSignOut(RemoteSignOutContext context) => Task.CompletedTask;

        /// <summary>
        /// Invoked with the security token that has been extracted from the protocol message.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task SecurityTokenReceived(SecurityTokenReceivedContext context) => Task.CompletedTask;

        /// <summary>
        /// Invoked after the security token has passed validation and a ClaimsIdentity has been generated.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task SecurityTokenValidated(SecurityTokenValidatedContext context)
        {
            try
            {
                int applicationId = _settingHelper.GetApplicationId();
                AuthResponse authResponse = _appUserService.AuthenticateADFS(applicationId,
                    context.Principal.Claims, context.Scheme.Name);

                if (authResponse.Status == AuthStatus.Success)
                {
                    _appUserService.SyncRolesForSelfService(authResponse.IdentityUser.UserName).ConfigureAwait(false);

                    string scheme = Convert.ToBase64String(Encoding.ASCII.GetBytes(context.Scheme.Name));
                    context.Response.Cookies.Append(Constants._cookieScheme, scheme, new CookieOptions
                    {
                        HttpOnly = true,
                        SameSite = SameSiteMode.Lax,
                        Secure = true
                    });
                    _signInManager.SignInWithClaimsAsync(authResponse.IdentityUser, false,
                        context.Principal.Claims);
                }
                else
                {
                    InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
                    if (authResponse.Status == AuthStatus.NoIdentity)
                    {
                        _logger.LogLogin(Constants._product, $"{Constants._unknownLoginAttemptFailed} - {StoreMode.ADFS} ({authResponse.Status})",
                            success: false, userGuid: null, _logger.GetIpAddress(context.HttpContext),
                            authResponse.UserName);
                    }
                    else if (logging.EnableLoginLogout)
                    {
                        _logger.LogLogin(Constants._product, $"{Constants._loginAttemptFailed} - {StoreMode.ADFS} ({authResponse.Status})",
                            success: false, authResponse.IdentityUser?.UserGuid,
                            logging.IncludeClientIp ? _logger.GetIpAddress(context.HttpContext) : null,
                            logging.IncludePrincipalId ? authResponse.IdentityUser?.UserName ?? authResponse.UserName : null);
                    }
                }

                Uri redirectUri = new(context.Properties.RedirectUri, UriKind.RelativeOrAbsolute);
                if (redirectUri.IsAbsoluteUri)
                    context.Properties.RedirectUri = redirectUri.PathAndQuery;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CustomWsFederationEvents).FullName, exception.Message, exception);
                context.Response.Redirect($"{context.Request.PathBase}/Errors/Error500");
            }
            return Task.CompletedTask;
        }

        /// <summary>
        /// Invoked after the remote ticket has been received.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override Task TicketReceived(TicketReceivedContext context) => Task.CompletedTask;
    }
}