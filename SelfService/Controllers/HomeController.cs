// --------------------------------------------------------------------
// <copyright file="HomeController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Logic;
using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Administration.Models.Enum;
using Hedtech.PowerCampus.Administration.Models.Settings;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using ITfoxtec.Identity.Saml2;
using ITfoxtec.Identity.Saml2.MvcCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Models.Account;
using SelfService.Models.Invitations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SelfService.Controllers
{
    /// <summary>
    /// Controller with views for Home
    /// </summary>
    /// <seealso cref="SelfService.Controllers.BaseController" />
    /// <seealso cref="BaseController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class HomeController : BaseController
    {
        /// <summary>
        /// The relay state sign out redirect location
        /// </summary>
        private const string _relayStateRedirectLocation = "SignOutRedirectLocation";

        /// <summary>
        /// The relay state token
        /// </summary>
        private const string _relayStateToken = "Token";

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<HomeController> _logger;

        /// <summary>
        /// The saml store settings
        /// </summary>
        private readonly List<SamlStoreSettings> _samlStoreSettings;

        /// <summary>
        /// The serialization helper
        /// </summary>
        private readonly ISerializationHelper _serializationHelper;

        /// <summary>
        /// The sign in manager
        /// </summary>
        private readonly CustomSignInManager _signInManager;

        /// <summary>
        /// Initializes a new instance of the <see cref="HomeController"/> class.
        /// </summary>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="signInManager">The sign in manager.<seealso cref="CustomSignInManager"/></param>
        /// <param name="serializationHelper">The serialization helper.<seealso cref="ISerializationHelper"/></param>
        /// <param name="logger">The logger.<seealso cref="IAppLogger{HomeController}"/></param>
        /// <param name="samlStoreSettings">The saml store settings.<seealso cref="IOptions{List{SamlStoreSettings}}"/></param>
        public HomeController(
            IInstitutionSettingService institutionSettingService,
            CustomSignInManager signInManager,
            ISerializationHelper serializationHelper,
            IAppLogger<HomeController> logger,
            IOptions<List<SamlStoreSettings>> samlStoreSettings)
        {
            _samlStoreSettings = samlStoreSettings.Value;
            _institutionSettingService = institutionSettingService;
            _signInManager = signInManager;
            _serializationHelper = serializationHelper;
            _logger = logger;
        }

        /// <summary>
        /// Accounts the confirmation.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public ActionResult AccountConfirmation()
        {
            try
            {
                if (TempData[Constants._accountInvitationTempData] != null)
                {
                    AccountInvitationViewModel accountInvitation
                        = _serializationHelper.ToObject<AccountInvitationViewModel>((string)TempData[Constants._accountInvitationTempData]);
                    if (!string.IsNullOrEmpty(accountInvitation.FullName))
                        ViewBag.AccountInvitation = TempData[Constants._accountInvitationTempData];
                    return View();
                }

                return RedirectToAction("Error404", "Errors");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(HomeController).FullName, exception.Message, exception);
                return RedirectToAction("Error500", "Errors");
            }
        }

        /// <summary>
        /// Default View.
        /// </summary>
        /// <returns>
        /// ActionResult
        /// </returns>
        [HttpGet]
        public ActionResult Index() => View();

        /// <summary>
        /// Logs the in.
        /// </summary>
        /// <param name="returnUrl">The return URL.</param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public ActionResult LogIn(string returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
            {
                if (string.IsNullOrEmpty(returnUrl))
                    return RedirectToAction("Index");
                else
                    return LocalRedirect(returnUrl);
            }
            string scheme = Request.Cookies[Constants._cookieScheme];
            return string.IsNullOrEmpty(scheme) ? View() : Challenge(Encoding.UTF8.GetString(Convert.FromBase64String(scheme)));
        }

        /// <summary>
        /// Logs out
        /// </summary>
        /// <param name="token">The token.</param>
        /// <param name="redirectLocation">The redirect location.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Home/LogOut/{token?}/{redirectLocation?}")]
        [AllowAnonymous]
        public async Task<ActionResult> LogOut(Guid? token, SignOutRedirectLocation? redirectLocation)
        {
            string userStoreName = HttpContext.Session.GetObject<string>(Constants._userStore);
            Claim authenticationMode = (User.Identity as ClaimsIdentity).Claims.FirstOrDefault(c => c.Type == Constants._authenticationModeClaimType);

            Saml2PostBinding binding = new();
            Saml2LogoutRequest saml2LogoutRequest = null;
            ActionResult samlResult = null;
            Dictionary<string, string> relayStateQuery = new();

            if (authenticationMode?.Value == nameof(StoreMode.SAML))
            {
                if (redirectLocation != null)
                    relayStateQuery.Add(_relayStateRedirectLocation, redirectLocation.ToString());
                else
                    relayStateQuery.Add(_relayStateRedirectLocation, nameof(SignOutRedirectLocation.Default));

                SamlStoreSettings samlStoreSetting = _samlStoreSettings.Find(sss => sss.Name == userStoreName);
                saml2LogoutRequest = await new Saml2LogoutRequest(samlStoreSetting, User).DeleteSession(HttpContext);
                samlResult = (ActionResult)binding.Bind(saml2LogoutRequest).ToActionResult();
            }

            string scheme = Request.Cookies[Constants._cookieScheme];
            if (!string.IsNullOrEmpty(scheme))
                scheme = Encoding.UTF8.GetString(Convert.FromBase64String(scheme));

            await UserSignOut();

            InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
            if (logging.EnableLoginLogout)
            {
                Claim userGuidClaim = User.Claims?.FirstOrDefault(c => string.Equals(c.Type, ClaimTypes.NameIdentifier));
                _logger.LogLogout(Constants._product, Constants._logoutAttempt, success: true,
                    userGuidClaim?.Value != null ? Guid.Parse(userGuidClaim.Value) : null,
                    logging.IncludeClientIp ? _logger.GetIpAddress(Request.HttpContext) : null,
                    logging.IncludePrincipalId ? User.Identity?.Name : null);
            }

            string redirectToUrl;
            if (token != null && token != Guid.Empty && redirectLocation != null)
            {
                redirectToUrl = redirectLocation switch
                {
                    SignOutRedirectLocation.RecoverPassword => Url.Action("Recovery", "Password", new { token }),
                    SignOutRedirectLocation.InvitationConfirmation => Url.Action("Confirmation", "Invitations", new { token }),
                    _ => Url.Action("LogIn")
                };

                if (authenticationMode?.Value == nameof(StoreMode.SAML))
                    relayStateQuery.Add(_relayStateToken, token.ToString());
            }
            else
            {
                redirectToUrl = Url.Action("LogIn");
            }

            if (string.IsNullOrEmpty(scheme))
            {
                if (authenticationMode?.Value == nameof(StoreMode.SAML))
                {
                    binding.SetRelayStateQuery(relayStateQuery);
                    return samlResult;
                }
                else
                {
                    return Redirect(redirectToUrl);
                }
            }

            if (Request.PathBase.Value.Length > 0 && redirectToUrl.StartsWith(Request.PathBase.Value))
                redirectToUrl = redirectToUrl[Request.PathBase.Value.Length..];

            AuthenticationProperties authProperties = new()
            {
                RedirectUri = redirectToUrl
            };

            return SignOut(authProperties, scheme);
        }

        /// <summary>
        /// Logs the out with return URL. Only used for Identity and Active Directory authorization modes
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> LogOutWithReturnUrl()
        {
            await UserSignOut();

            InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
            if (logging.EnableLoginLogout)
            {
                Claim userGuidClaim = User.Claims?.FirstOrDefault(c => string.Equals(c.Type, ClaimTypes.NameIdentifier));
                _logger.LogLogout(Constants._product, Constants._logoutAttempt, success: true,
                    userGuidClaim?.Value != null ? Guid.Parse(userGuidClaim.Value) : null,
                    logging.IncludeClientIp ? _logger.GetIpAddress(Request.HttpContext) : null,
                    logging.IncludePrincipalId ? User.Identity?.Name : null);
            }

            return RedirectToAction("LogIn", new { ReturnUrl = Request.GetTypedHeaders().Referer.PathAndQuery });
        }

        /// <summary>
        /// Recovers password
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public ActionResult RecoverPassword()
        {
            try
            {
                if (TempData[Constants._passwordRecoveryRequestTempData] != null)
                {
                    AppPasswordRecoveryRequest appPasswordRecoveryRequest
                        = _serializationHelper.ToObject<AppPasswordRecoveryRequest>((string)TempData[Constants._passwordRecoveryRequestTempData]);
                    string appPasswordRecoveryRequestIds = $"{appPasswordRecoveryRequest.AppPasswordRecoveryRequestId}/{appPasswordRecoveryRequest.AppUserId}";
                    ViewBag.RecoveryCode = Convert.ToBase64String(Encoding.ASCII.GetBytes(appPasswordRecoveryRequestIds));
                    return View();
                }

                return RedirectToAction("Error404", "Errors");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(HomeController).FullName, exception.Message, exception);
                return RedirectToAction("Error500", "Errors");
            }
        }

        /// <summary>
        /// Samls the logout.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Home/SamlLoggedOut")]
        [AllowAnonymous]
        public ActionResult SamlLoggedOut()
        {
            Saml2PostBinding binding = new();
            Saml2LogoutResponse saml2LogoutResponse;

            for (int i = 0; i < _samlStoreSettings.Count; i++)
            {
                try
                {
                    binding = new Saml2PostBinding();
                    saml2LogoutResponse = new(_samlStoreSettings[i]);
                    binding.ReadSamlResponse(Request.ToGenericHttpRequest(), saml2LogoutResponse);
                    break;
                }
                catch (Exception) { }
            }

            Dictionary<string, string> relayStateQuery = binding.GetRelayStateQuery();

            SignOutRedirectLocation redirectLocation = relayStateQuery.ContainsKey(_relayStateRedirectLocation)
                ? (SignOutRedirectLocation)Enum.Parse(typeof(SignOutRedirectLocation), relayStateQuery[_relayStateRedirectLocation])
                : SignOutRedirectLocation.Default;

            Guid token = relayStateQuery.ContainsKey(_relayStateToken)
                ? Guid.Parse(relayStateQuery[_relayStateToken])
                : default;

            return redirectLocation switch
            {
                SignOutRedirectLocation.Default => RedirectToAction("LogIn"),
                SignOutRedirectLocation.RecoverPassword => RedirectToAction("Recovery", "Password", new { token }),
                SignOutRedirectLocation.InvitationConfirmation => RedirectToAction("Confirmation", "Invitations", new { token }),
                _ => null
            };
        }

        /// <summary>
        /// Signs the out confirmation.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public ActionResult SignOutConfirmation()
        {
            if (TempData[Constants._signOutValidationTempData] != null)
            {
                SignOutValidationViewModel signOutValidation
                    = _serializationHelper.ToObject<SignOutValidationViewModel>((string)TempData[Constants._signOutValidationTempData]);
                if (signOutValidation.RedirectLocation == SignOutRedirectLocation.Default || signOutValidation.Token != Guid.Empty)
                {
                    ViewBag.SignOutValidation = TempData[Constants._signOutValidationTempData];
                    return View();
                }
            }
            return RedirectToAction("Error404", "Errors");
        }

        /// <summary>
        /// Signs the out redirection.
        /// </summary>
        /// <param name="redirectLocation">The redirect location.</param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult SignOutRedirection(SignOutRedirectLocation redirectLocation)
        {
            TempData[Constants._signOutValidationTempData] = _serializationHelper.ToJsonObject(new SignOutValidationViewModel
            {
                LoggedUserName = Account.UserName,
                RedirectLocation = redirectLocation
            });
            return RedirectToAction("SignOutConfirmation");
        }

        #region Private Methods

        /// <summary>
        /// Represents an event that is raised when the sign-out operation is complete.
        /// </summary>
        private async Task UserSignOut()
        {
            HttpContext.Session.Clear();
            await _signInManager.SignOutAsync();
            Response.Cookies.Delete(Constants._cookieScheme);
        }

        #endregion Private Methods
    }
}