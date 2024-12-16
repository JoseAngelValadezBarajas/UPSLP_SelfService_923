// --------------------------------------------------------------------
// <copyright file="Constants.cs" company="Ellucian">
//     Copyright 2018 - 2024 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Reflection;

namespace SelfService
{
    /// <summary>
    /// Constants
    /// </summary>
    internal static class Constants
    {
        #region Cache

        /// <summary>
        /// The application identifier cache
        /// </summary>
        internal static readonly string _applicationIdCache = "SSApplicationId";

        /// <summary>
        /// The build information cache
        /// </summary>
        internal static readonly string _buildInfoCache = "SSBuilInfo";

        /// <summary>
        /// The cache expiration time
        /// </summary>
        internal static readonly int _cacheExpirationTime = 60;

        #endregion Cache

        #region Claims

        /// <summary>
        /// The access token claim type
        /// </summary>
        internal const string _accessTokenClaimType = "access_token";

        /// <summary>
        /// The authentication mode claim type
        /// </summary>
        internal const string _authenticationModeClaimType = "authentication_mode";

        #endregion Claims

        #region Client

        /// <summary>
        /// The notifications client
        /// </summary>
        internal const string _notificationsClient = "SSNotificationsClient";

        /// <summary>
        /// The re captcha client
        /// </summary>
        internal const string _reCaptchaClient = "SSReCaptchaClient";

        #endregion Client

        #region Cookies

        /// <summary>
        /// The adfs cookie name
        /// </summary>
        internal static readonly string _adfsCookieName = "SelfServiceADFS";

        /// <summary>
        /// The adfs correlation cookie name
        /// </summary>
        internal static readonly string _adfsCorrelationCookieName = "SelfServiceCoADFS";

        /// <summary>
        /// The cookie cache prefix
        /// </summary>
        internal static readonly string _cookieCachePrefix = "SSAuthSessionStore";

        /// <summary>
        /// The cookie name
        /// </summary>
        internal static readonly string _cookieName = "SelfService";

        /// <summary>
        /// The cookie scheme
        /// </summary>
        internal static readonly string _cookieScheme = "SelfServiceScheme";

        /// <summary>
        /// The default cookie timeout
        /// </summary>
        internal static readonly int _defaultCookieTimeout = 15;

        /// <summary>
        /// The default notification timeout
        /// </summary>
        internal static readonly int _defaultNotificationTimeout = 60;

        /// <summary>
        /// The external cookie cache prefix
        /// </summary>
        internal static readonly string _externalCookieCachePrefix = "SSExternalAuthSessionStore";

        /// <summary>
        /// The session cookie name
        /// </summary>
        internal static readonly string _sessionCookieName = ".SelfService.Session";

        #endregion Cookies

        #region Headers

        /// <summary>
        /// The custom header for current page
        /// </summary>
        internal static readonly string _xCurrentPage = "X-Current-Page";

        #endregion Headers

        #region Query String

        /// <summary>
        /// The current page query string
        /// </summary>
        internal static readonly string _currentPageQueryString = "currentPage";

        #endregion Query String

        #region Logging

        /// <summary>
        /// The login attempt
        /// </summary>
        internal const string _loginAttempt = "Login attempt";

        /// <summary>
        /// The login attempt failed
        /// </summary>
        internal const string _loginAttemptFailed = "Login attempt failed";

        /// <summary>
        /// The logout attempt
        /// </summary>
        internal const string _logoutAttempt = "Logout attempt";

        /// <summary>
        /// The permission evaluation failed
        /// </summary>
        internal const string _permissionEvaluationFailed = "Permission evaluation failed";

        /// <summary>
        /// The unknown login attempt failed
        /// </summary>
        internal const string _unknownLoginAttemptFailed = "Unknown user login attempt failed";

        #endregion Logging

        #region Session

        /// <summary>
        /// The account session
        /// </summary>
        internal static readonly string _accountSession = "SSAccount";

        /// <summary>
        /// The application form setting identifier session
        /// </summary>
        internal static readonly string _applicationFormSettingIdSession = "SSApplicationFormSettingId";

        /// <summary>
        /// The current link identifier session
        /// </summary>
        internal static readonly string _currentLinkIdSession = "SSCurrentLinkId";

        /// <summary>
        /// The name format session
        /// </summary>
        internal static readonly string _nameFormatSession = "SSNameFormat";

        /// <summary>
        /// The payment information session
        /// </summary>
        internal static readonly string _paymentInfoSession = "SSPaymentInfo";

        /// <summary>
        /// The payment return URL session
        /// </summary>
        internal static readonly string _paymentReturnUrlSession = "SSPaymentReturnUrl";

        /// <summary>
        /// The registration log identifier session
        /// </summary>
        internal static readonly string _registrationLogIdSession = "SSRegistrationLogId";

        /// <summary>
        /// The site map authenticated session
        /// </summary>
        internal static readonly string _siteMapAuthenticatedSession = "SSSiteMapAuthenticated";

        /// <summary>
        /// The site map session
        /// </summary>
        internal static readonly string _siteMapSession = "SSSiteMap";

        /// <summary>
        /// The user store session
        /// </summary>
        internal static readonly string _userStore = "SSUserStore";

        #endregion Session

        #region TempData

        /// <summary>
        /// The account invitation temporary data
        /// </summary>
        internal static readonly string _accountInvitationTempData = "SSAccountInvitation";

        /// <summary>
        /// The application information temporary data
        /// </summary>
        internal static readonly string _applicationInfoTempData = "SSApplicationInfo";

        /// <summary>
        /// The password recovery request temporary data
        /// </summary>
        internal static readonly string _passwordRecoveryRequestTempData = "SSPasswordRecoveryRequest";

        /// <summary>
        /// The payment transaction temporary data
        /// </summary>
        internal static readonly string _paymentTransactionTempData = "SSPaymentTransaction";

        /// <summary>
        /// The sign out validation temporary data
        /// </summary>
        internal static readonly string _signOutValidationTempData = "SSSignOutValidation";

        #endregion TempData

        /// <summary>
        /// The anonymous role
        /// </summary>
        internal static readonly string _anonymousRole = "anonymous";

        /// <summary>
        /// The application form setting identifier
        /// </summary>
        internal static readonly int _applicationFormSettingId = 1;

        /// <summary>
        /// The portal application identifier
        /// </summary>
        internal static readonly string _portalApplicationId = "Portal";

        /// <summary>
        /// The product
        /// </summary>
        internal static readonly string _product = $"SelfService {Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion}";

        /// <summary>
        /// The product catalog name
        /// </summary>
        internal static readonly string _productCatalogName = "SelfService";
    }
}