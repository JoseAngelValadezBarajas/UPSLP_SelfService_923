// --------------------------------------------------------------------
// <copyright file="SigInController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Logic;
using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Administration.Models.Enum;
using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Administration.Models.Settings;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using ITfoxtec.Identity.Saml2;
using ITfoxtec.Identity.Saml2.MvcCore;
using ITfoxtec.Identity.Saml2.Schemas;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Account;
using SelfService.Models.Responses;
using SelfService.Models.SignIn;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Security.Claims;
using System.Threading.Tasks;
using TemporaryUser = Hedtech.PowerCampus.Core.DTO.Foundation.TemporaryUser;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /SignIn route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class SignInController : BaseEndpointController
    {
        /// <summary>
        /// The relay state return URL
        /// </summary>
        private const string _relayStateReturnUrl = "ReturnUrl";

        /// <summary>
        /// The active directory store settings
        /// </summary>
        private readonly List<ActiveDirectoryStoreSettings> _activeDirectoryStoreSettings;

        /// <summary>
        /// The adfs store settings
        /// </summary>
        private readonly List<AdfsStoreSettings> _adfsStoreSettings;

        /// <summary>
        /// The application password recovery request service
        /// </summary>
        private readonly IAppPasswordRecoveryRequestService _appPasswordRecoveryRequestService;

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
        private readonly IAppLogger<SignInController> _logger;

        /// <summary>
        /// The login settings
        /// </summary>
        private readonly LoginSettings _loginSettings;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The saml store settings
        /// </summary>
        private readonly List<SamlStoreSettings> _samlStoreSettings;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// The sign in manager
        /// </summary>
        private readonly CustomSignInManager _signInManager;

        /// <summary>
        /// The temporary user service
        /// </summary>
        private readonly ITemporaryUserService _temporaryUserService;

        /// <summary>
        /// Initializes a new instance of the <see cref="SignInController"/> class.
        /// </summary>
        /// <param name="activeDirectoryStoreSettings">The active directory store settings.</param>
        /// <param name="adfsStoreSettings">The ADFS store settings.</param>
        /// <param name="loginSettings">The login settings.</param>
        /// <param name="samlStoreSettings">The SAML store settings.</param>
        /// <param name="signInManager">The sign in manager.</param>
        /// <param name="appPasswordRecoveryRequestService">The application password recovery request service.</param>
        /// <param name="appStoreService">The application store service.</param>
        /// <param name="appUserService">The application user service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="logger">The logger.</param>
        public SignInController(
            IOptions<List<ActiveDirectoryStoreSettings>> activeDirectoryStoreSettings,
            IOptions<List<AdfsStoreSettings>> adfsStoreSettings,
            IOptions<LoginSettings> loginSettings,
            IOptions<List<SamlStoreSettings>> samlStoreSettings,
            CustomSignInManager signInManager,
            IAppPasswordRecoveryRequestService appPasswordRecoveryRequestService,
            IAppStoreService appStoreService,
            IAppUserService appUserService,
            IInstitutionSettingService institutionSettingService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            ITemporaryUserService temporaryUserService,
            IAppLogger<SignInController> logger)
            : base(serializationHelper)
        {
            _activeDirectoryStoreSettings = activeDirectoryStoreSettings.Value;
            _adfsStoreSettings = adfsStoreSettings.Value;
            _loginSettings = loginSettings.Value;
            _samlStoreSettings = samlStoreSettings.Value;

            _signInManager = signInManager;

            _appPasswordRecoveryRequestService = appPasswordRecoveryRequestService;
            _appStoreService = appStoreService;
            _appUserService = appUserService;
            _institutionSettingService = institutionSettingService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _settingHelper = settingHelper;
            _temporaryUserService = temporaryUserService;

            _logger = logger;
        }

        /// <summary>
        /// Adfses the challenge.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("SignIn/ADFSChallenge")]
        public ActionResult ADFSChallenge([FromQuery] string userName)
        {
            userName ??= Account?.UserName;
            if (!User.Identity.IsAuthenticated && !string.IsNullOrEmpty(userName))
            {
                (int result, int? appStoreMode, string appStoreName, _) = GetAuthenticationMode(userName);

                if (result == 2 && appStoreMode == (int)StoreMode.ADFS && !string.IsNullOrEmpty(appStoreName))
                {
                    AdfsStoreSettings adfsStore = _adfsStoreSettings.Find(s => s.Name == appStoreName);
                    if (adfsStore != null)
                    {
                        AuthenticationProperties authProperties = new()
                        {
                            RedirectUri = Url.Action("Index", "Home")
                        };
                        return Challenge(authProperties, adfsStore.Name);
                    }
                    _logger.LogError(Constants._product, typeof(SignInController).FullName, $"User Store: Missing {appStoreName} settings");
                }
            }

            return RedirectToAction("Index", "Home");
        }

        /// <summary>
        /// Endpoint to authenticate the user
        /// </summary>
        /// <param name="credentials">The credentials.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("SignIn/Authenticate")]
        public async Task<JsonResult> Authenticate([FromBody] CredentialsModel credentials)
        {
            HttpContext.Session.Clear();
            int applicationId = _settingHelper.GetApplicationId();
            AuthResponse response = new();

            try
            {
                InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);

                (AppUser appUser, string appUserName) = GetUser(applicationId, credentials.UserName);

                response = await _appUserService.Authenticate(applicationId, appUserName, credentials.Password, _activeDirectoryStoreSettings);

                if (response.Mode == StoreMode.ActiveDirectory && response.Status == AuthStatus.NoIdentity)
                {
                    _logger.LogError(Constants._product, typeof(SignInController).FullName
                        , $"{credentials.UserName} has been authenticated properly in Active Directory but it has no record in the Identity database");
                }
                string responseModeText = response.Mode != null ? $"- {response.Mode} " : string.Empty;
                if (response.Status is AuthStatus.NoIdentity or AuthStatus.InvalidCredentials)
                {
                    _logger.LogLogin(Constants._product, $"{Constants._unknownLoginAttemptFailed} {responseModeText}({response.Status})",
                        success: false, userGuid: null, _logger.GetIpAddress(Request.HttpContext), appUserName);
                }
                else if (logging.EnableLoginLogout && response.Status != AuthStatus.Success)
                {
                    _logger.LogLogin(Constants._product, $"{Constants._loginAttemptFailed} {responseModeText}({response.Status})", success: false,
                        appUser?.UserGuid, logging.IncludeClientIp ? _logger.GetIpAddress(Request.HttpContext) : null,
                        logging.IncludePrincipalId ? appUserName : null);
                }

                if (response.Status is AuthStatus.IsLocked
                    or AuthStatus.InvalidPassword
                    or AuthStatus.InvalidCredentials
                    or AuthStatus.InvalidConfiguration)
                {
                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        status = (int)response.Status,
                        success = false,
                        attempt = response.Attempt
                    }));
                }

                if (response.Status == AuthStatus.Success && !response.ChangePasswordAtNextLogon && !string.IsNullOrEmpty(appUserName))
                {
                    await _appUserService.SyncRolesForSelfService(credentials.UserName);

                    int personId = _peopleService.GetPersonId(appUserName);
                    TemporaryUser temporaryUser = null;
                    if (personId <= 0)
                        temporaryUser = _temporaryUserService.Get(credentials.UserName);

                    if (personId > 0 || temporaryUser != null)
                    {
                        await _signInManager.SignInAsync(response.IdentityUser, false);
                    }
                    else
                    {
                        _logger.LogError(new LogDetail(Constants._product, typeof(SignInController).FullName,
                            $"{response.IdentityUser?.UserGuid} is not sync, verify Identity and Person User information.")
                        {
                            ClientIp = logging.IncludeClientIp ? _logger.GetIpAddress(Request.HttpContext) : null,
                            PrincipalId = logging.IncludePrincipalId ? appUserName : null,
                            UserGuid = response.IdentityUser?.UserGuid
                        });
                    }
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SignInController).FullName, exception.Message, exception);
            }
            return Json(SerializationHelper.ToJsonResult(new
            {
                status = (int)response.Status,
                success = response.Status == AuthStatus.Success,
                changePasswordAtNextLogon = response.ChangePasswordAtNextLogon
            }));
        }

        /// <summary>
        /// Gets the authentication mode.
        /// </summary>
        /// <param name="userName">The user name.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("SignIn/GetAuthenticationMode")]
        public async Task<JsonResult> AuthenticationMode([FromBody] string userName)
        {
            try
            {
                (int result, int? appStoreMode, _, string appUserName) = GetAuthenticationMode(userName);

                return Json(SerializationHelper.ToJsonResult(new { variation = result, mode = appStoreMode, userName = appUserName }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SignInController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Determines whether this instance is authenticated.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("SignIn/IsAuthenticated")]
        public JsonResult IsAuthenticated() => Json(SerializationHelper.ToJsonResult(User.Identity.IsAuthenticated));

        /// <summary>
        /// Determines whether [is forgot password enabled].
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("SignIn/IsForgotPasswordEnabled")]
        public JsonResult IsForgotPasswordEnabled()
        {
            try
            {
                List<AppStore> appStores = _appStoreService.Get(_settingHelper.GetApplicationId());

                bool isForgotPasswordEnabled = appStores != null && appStores.Any(s =>
                (((StoreMode)s.Mode == StoreMode.Identity || (StoreMode)s.Mode == StoreMode.ActiveDirectory) && s.ForgotPasswordOption != null)
                || (((StoreMode)s.Mode == StoreMode.ADFS || (StoreMode)s.Mode == StoreMode.SAML) && !string.IsNullOrEmpty(s.ForgotPasswordURL)));

                bool isReCaptchaEnabled = false;
                string reCaptchaSiteKey = string.Empty;
                if (isForgotPasswordEnabled)
                {
                    InstitutionSettings.ReCaptcha reCaptchaSettings = _institutionSettingService.GetReCaptcha();
                    isReCaptchaEnabled = reCaptchaSettings.EnableForgotPassword;
                    reCaptchaSiteKey = reCaptchaSettings.SiteKey;
                }

                return Json(SerializationHelper.ToJsonResult(new { isForgotPasswordEnabled, isReCaptchaEnabled, reCaptchaSiteKey }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SignInController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Eeids this instance. This endpoint redirects to Ellucian Ethos Identity (EEID) application.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Sso/SAML")]
        public ActionResult SAMLChallenge([FromQuery] string userName)
        {
            userName ??= Account?.UserName;

            (int result, int? appStoreMode, string appStoreName, _) = GetAuthenticationMode(userName);

            if (result == 2 && appStoreMode == (int)StoreMode.SAML && !string.IsNullOrEmpty(appStoreName))
            {
                string returnUrl = Request.GetTypedHeaders().Referer?.AbsoluteUri;
                SamlStoreSettings samlStoreSetting = _samlStoreSettings.Find(s => s.Name == appStoreName);

                if (samlStoreSetting != null)
                {
                    Saml2RedirectBinding binding = new();

                    binding.SetRelayStateQuery(new Dictionary<string, string> { { _relayStateReturnUrl, returnUrl ?? HttpContext.Request.PathBase } });
                    binding = binding.Bind(new Saml2AuthnRequest(samlStoreSetting));

                    RedirectResult redirectResult = (RedirectResult)binding.ToActionResult();
                    if (!string.IsNullOrEmpty(userName))
                        redirectResult.Url = redirectResult.Url + $"&login_hint={userName}";
                    return redirectResult;
                }
                _logger.LogError(Constants._product, typeof(SignInController).FullName, $"User Store: Missing {appStoreName} settings");
            }

            return RedirectToAction("Index", "Home");
        }

        /// <summary>
        /// Completes the specified SAML response.
        /// </summary>
        /// <param name="response">The response.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sso/Complete")]
        public ActionResult SAMLComplete(SamlResponse response)
        {
            try
            {
                if (response != null)
                {
                    int applicationId = _settingHelper.GetApplicationId();
                    InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);

                    Saml2PostBinding binding = new();
                    Saml2AuthnResponse saml2AuthnResponse = null;

                    string appStoreName = null;
                    for (int i = 0; i < _samlStoreSettings.Count; i++)
                    {
                        try
                        {
                            saml2AuthnResponse = new(_samlStoreSettings[i]);
                            binding.ReadSamlResponse(Request.ToGenericHttpRequest(), saml2AuthnResponse);
                            appStoreName = _samlStoreSettings[i].Name;
                            break;
                        }
                        catch (Exception)
                        {
                            continue;
                        }
                    }

                    string ssoUsername = saml2AuthnResponse?.NameId?.Value;
                    if (saml2AuthnResponse is null || saml2AuthnResponse.Status != Saml2StatusCodes.Success)
                    {
                        if (logging.EnableLoginLogout)
                        {
                            _logger.LogLogin(Constants._product, $"{Constants._loginAttemptFailed} - {StoreMode.SAML} ({saml2AuthnResponse?.Status})", success: false, userGuid: null,
                                logging.IncludeClientIp ? _logger.GetIpAddress(Request.HttpContext) : null,
                                logging.IncludePrincipalId ? ssoUsername : null);
                        }
                        throw new AuthenticationException($"SAML Response status: {saml2AuthnResponse?.Status}");
                    }
                    binding.Unbind(Request.ToGenericHttpRequest(), saml2AuthnResponse);

                    Dictionary<string, string> relayStateQuery = binding.GetRelayStateQuery();
                    string returnUrl = relayStateQuery.ContainsKey(_relayStateReturnUrl) ? relayStateQuery[_relayStateReturnUrl] : Url.Content("~/");

                    AuthResponse authResponse = _appUserService.AuthenticateSAML(applicationId, ssoUsername);
                    ssoUsername = ssoUsername == string.Empty ? null : ssoUsername;
                    if (authResponse.Status == AuthStatus.Success)
                    {
                        _appUserService.SyncRolesForSelfService(ssoUsername).ConfigureAwait(false);

                        HttpContext.Session.SetObject(Constants._userStore, appStoreName);

                        List<Claim> claims = new();
                        claims.AddRange(saml2AuthnResponse.ClaimsIdentity.Claims);
                        claims.Add(new(Constants._authenticationModeClaimType, nameof(StoreMode.SAML)));
                        _ = _signInManager.SignInWithClaimsAsync(authResponse.IdentityUser, false, claims);
                        return Redirect(returnUrl);
                    }
                    else if (authResponse.Status == AuthStatus.NoIdentity)
                    {
                        _logger.LogLogin(Constants._product, $"{Constants._unknownLoginAttemptFailed} - {StoreMode.SAML} ({authResponse.Status})",
                            success: false, userGuid: null, _logger.GetIpAddress(Request.HttpContext), ssoUsername ?? authResponse.UserName);
                    }
                    else if (logging.EnableLoginLogout)
                    {
                        _logger.LogLogin(Constants._product, $"{Constants._loginAttemptFailed} - {StoreMode.SAML} ({authResponse.Status})",
                            success: false, authResponse.IdentityUser?.UserGuid,
                            logging.IncludeClientIp ? _logger.GetIpAddress(Request.HttpContext) : null,
                            logging.IncludePrincipalId ? ssoUsername ?? authResponse.UserName : null);
                    }
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SignInController).FullName, exception.Message, exception);
                return RedirectToAction("Error500", "Errors");
            }
            return RedirectToAction("Error400", "Errors");
        }

        /// <summary>
        /// Sends the forgot password email.
        /// </summary>
        /// <param name="reCaptchaResponse">The re captcha response.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ReCaptchaValidateAttribute), Arguments = new object[] { ReCaptchaOrigin.ForgotPasswordSendEmail })]
        [Route("SignIn/SendForgotPasswordEmail")]
        public async Task<JsonResult> SendForgotPasswordEmail([FromBody] ReCaptchaResponseModel reCaptchaResponse)
        {
            try
            {
                int selfServiceId = _settingHelper.GetApplicationId();
                bool result = false;
                (AppUser appUser, _) = GetUser(selfServiceId, reCaptchaResponse.UserName);
                if (appUser != null && appUser.CreationAppStoreId.HasValue)
                {
                    List<NotificationToken> notificationTokens = _notificationsHelper.GetPersonNotificationTokensByUserName(_peopleService, _temporaryUserService, reCaptchaResponse.UserName);

                    if (notificationTokens?.Count > 0)
                    {
                        IEnumerable<AppStore> appStores = _appStoreService.Get(selfServiceId);
                        AppStore appStore = appStores?.FirstOrDefault(x => x.AppStoreId == appUser.CreationAppStoreId.Value);
                        if (appStore != null)
                        {
                            ForgotPasswordOption? forgotPasswordOption = null;
                            string eventNotification = string.Empty;
                            switch ((StoreMode)appStore.Mode)
                            {
                                case StoreMode.Identity:
                                case StoreMode.ActiveDirectory:
                                    switch (appStore.ForgotPasswordOption)
                                    {
                                        case null:
                                            eventNotification = NotificationEvent.UsersAccountForgotPasswordNoSetup;
                                            break;

                                        case ForgotPasswordOption.ByToken:
                                            eventNotification = NotificationEvent.UsersAccountForgotPassword;
                                            forgotPasswordOption = ForgotPasswordOption.ByToken;
                                            break;

                                        case ForgotPasswordOption.External:
                                            eventNotification = NotificationEvent.UsersAccountForgotPasswordUrl;
                                            forgotPasswordOption = ForgotPasswordOption.External;
                                            break;

                                        default:
                                            break;
                                    }
                                    break;

                                case StoreMode.ADFS:
                                case StoreMode.SAML:
                                    if (!string.IsNullOrEmpty(appStore.ForgotPasswordURL))
                                    {
                                        eventNotification = NotificationEvent.UsersAccountForgotPasswordUrl;
                                        forgotPasswordOption = ForgotPasswordOption.External;
                                    }
                                    else
                                    {
                                        eventNotification = NotificationEvent.UsersAccountForgotPasswordNoSetup;
                                    }

                                    break;

                                default:
                                    break;
                            }
                            if (!string.IsNullOrEmpty(eventNotification))
                            {
                                bool isActive = await _notificationsHelper.EventIsActiveAsync(eventNotification).ConfigureAwait(false);
                                if (isActive)
                                {
                                    switch (forgotPasswordOption)
                                    {
                                        case ForgotPasswordOption.ByToken:
                                            Guid passwordRecoveryToken = Guid.NewGuid();
                                            int appPasswordRecoveryRequestId = _appPasswordRecoveryRequestService.Create(new AppPasswordRecoveryRequest
                                            {
                                                AppUserId = appUser.Id,
                                                ExpirationMinutes = (int?)appStore.TokenExpirationMinutes ?? 0,
                                                RequestToken = passwordRecoveryToken
                                            });
                                            if (appPasswordRecoveryRequestId > 0)
                                            {
                                                string baseAddress = Request.PathBase.Value;
                                                if (baseAddress.EndsWith("/"))
                                                    baseAddress = baseAddress.Length > 1 ? baseAddress[0..^2] : string.Empty;
                                                string host = Request.Host.Value;
                                                string confirmationUrl = $"{Request.Scheme}://{host}{baseAddress}/Password/Recovery/{passwordRecoveryToken}";
                                                notificationTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "tokenurl", Value = confirmationUrl } });
                                            }
                                            else
                                            {
                                                _logger.LogError(Constants._product, typeof(SignInController).FullName, "Recovery Token was not generated");
                                                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
                                            }
                                            break;

                                        case ForgotPasswordOption.External:
                                            notificationTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "url", Value = appStore.ForgotPasswordURL } });
                                            break;

                                        default:
                                            break;
                                    }
                                    _notificationsHelper.Create(new NotificationEventModel
                                    {
                                        EventKey = eventNotification,
                                        Tokens = notificationTokens
                                    });
                                    result = true;
                                }
                            }
                        }
                    }
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SignInController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #region Private Methods

        /// <summary>
        /// Gets the authentication mode.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <returns>
        /// The (int, int?, string, string) of authentication mode.
        /// <see cref="(int, int?, string, string)"/>
        /// </returns>
        private (int, int?, string, string) GetAuthenticationMode(string userName)
        {
            try
            {
                int applicationId = _settingHelper.GetApplicationId();

                (AppUser appUser, string appUserName) = GetUser(applicationId, userName);

                if (appUser is null)
                {
                    _logger.LogLogin(Constants._product, $"{Constants._unknownLoginAttemptFailed} ({AuthStatus.NoIdentity})",
                        success: false, userGuid: null,
                        _logger.GetIpAddress(Request.HttpContext), userName);
                    return (0, null, string.Empty, string.Empty);
                }

                if (!appUser.AuthenticationAppStoreId.HasValue)
                {
                    _logger.LogError(Constants._product, typeof(SignInController).FullName, $"{appUser.UserGuid} has not AuthenticationAppStore");
                    return (1, null, string.Empty, string.Empty);
                }

                AppStore appStore = _appStoreService.GetStoreById(appUser.AuthenticationAppStoreId.Value);
                if (appStore is null)
                {
                    _logger.LogError(Constants._product, typeof(SignInController).FullName, $"User Store is null: {appUser.AuthenticationAppStoreId.Value}");
                }
                HttpContext.Session.SetObject(Constants._userStore, appStore?.Name);

                return (2, appStore?.Mode, appStore?.Name, appUserName);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SignInController).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Gets the user.
        /// </summary>
        /// <param name="userName">The user name.</param>
        /// <returns></returns>
        private (AppUser, string) GetUser(int applicationId, string userName)
        {
            try
            {
                AppUser appUser;
                if (userName.Contains('\\') || userName.Contains('@'))
                {
                    appUser = _appUserService.GetByApplication(applicationId, userName);
                    return (appUser, userName);
                }
                else if (_loginSettings.UseMaskFirst)
                {
                    string mask = _loginSettings.UserNameMask;
                    string maskedUsername = mask.Replace("{0}", userName);
                    appUser = _appUserService.GetByApplication(applicationId, maskedUsername);
                    if (appUser != null)
                        return (appUser, maskedUsername);

                    appUser = _appUserService.GetByApplication(applicationId, userName);
                    return (appUser, userName);
                }
                else
                {
                    string mask = _loginSettings.UserNameMask;
                    string maskedUsername = mask.Replace("{0}", userName);

                    appUser = _appUserService.GetByApplication(applicationId, userName);
                    if (appUser != null)
                        return (appUser, userName);

                    appUser = _appUserService.GetByApplication(applicationId, maskedUsername);
                    return (appUser, userName);
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SignInController).FullName, exception.Message, exception);
                throw;
            }
        }

        #endregion Private Methods
    }
}