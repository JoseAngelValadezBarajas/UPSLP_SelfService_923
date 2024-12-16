// --------------------------------------------------------------------
// <copyright file="PasswordController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Logic;
using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Administration.Models.Enum;
using Hedtech.PowerCampus.Administration.Models.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Account;
using SelfService.Models.Account.MyProfile;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Cart route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class PasswordController : BaseEndpointController
    {
        /// <summary>
        /// The active directory store settings
        /// </summary>
        private readonly List<ActiveDirectoryStoreSettings> _activeDirectoryStoreSettings;

        /// <summary>
        /// The application password policy service
        /// </summary>
        private readonly IAppPasswordPolicyService _appPasswordPolicyService;

        /// <summary>
        /// The application password recovery request service
        /// </summary>
        private readonly IAppPasswordRecoveryRequestService _appPasswordRecoveryRequestService;

        /// <summary>
        /// The application user service
        /// </summary>
        private readonly IAppUserService _appUserService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<PasswordController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// The sign in manager
        /// </summary>
        private readonly CustomSignInManager _signInManager;

        /// <summary>
        /// Initializes a new instance of the <see cref="PasswordController"/> class.
        /// </summary>
        /// <param name="activeDirectoryStoreSettings">The active directory store settings.</param>
        /// <param name="signInManager">The sign in manager.</param>
        /// <param name="appPasswordPolicyService">The application password policy service.</param>
        /// <param name="appPasswordRecoveryRequestService">The application password recovery request service.</param>
        /// <param name="appUserService">The application user service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="logger">The logger.</param>
        public PasswordController(
            IOptions<List<ActiveDirectoryStoreSettings>> activeDirectoryStoreSettings,
            CustomSignInManager signInManager,
            IAppPasswordPolicyService appPasswordPolicyService,
            IAppPasswordRecoveryRequestService appPasswordRecoveryRequestService,
            IAppUserService appUserService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            IAppLogger<PasswordController> logger)
            : base(serializationHelper)
        {
            _activeDirectoryStoreSettings = activeDirectoryStoreSettings.Value;

            _signInManager = signInManager;

            _appPasswordPolicyService = appPasswordPolicyService;
            _appPasswordRecoveryRequestService = appPasswordRecoveryRequestService;
            _appUserService = appUserService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _settingHelper = settingHelper;

            _logger = logger;
        }

        /// <summary>
        /// Changes the password for the logged user (e.g. from the profile)
        /// </summary>
        /// <param name="passwordChange">The PasswordChangeModel model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Password/Change")]
        public async Task<JsonResult> Change([FromBody] PasswordChangeModel passwordChange)
        {
            try
            {
                PasswordResult passwordResult = await _appUserService.ChangePasswordAsync(_settingHelper.GetApplicationId(),
                    User.Identity.Name, passwordChange.CurrentPassword, passwordChange.NewPassword, _activeDirectoryStoreSettings);
                if (passwordResult.UpdatedSuccessfully)
                    await _notificationsHelper.SendAsync(User.Identity.Name, passwordChange.NewPassword, Account.Email, Account.PersonId);
                else
                    RegisterPasswordChangeErrors(User.Identity.Name, passwordResult.Errors);

                return Json(SerializationHelper.ToJsonResult(passwordResult));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PasswordController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Changes the password of the received username (e.g. from the SignIn, where the user is not logged in)
        /// </summary>
        /// <param name="passwordChange">The password change.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Password/ChangePassword")]
        public async Task<JsonResult> ChangePassword([FromBody] PasswordChangeModel passwordChange)
        {
            try
            {
                PasswordResult passwordResult = await _appUserService.ChangePasswordAsync(_settingHelper.GetApplicationId(),
                    passwordChange.UserName, passwordChange.CurrentPassword, passwordChange.NewPassword, _activeDirectoryStoreSettings);
                if (passwordResult.UpdatedSuccessfully)
                {
                    AuthResponse response = await _appUserService.Authenticate(_settingHelper.GetApplicationId(),
                        passwordChange.UserName, passwordChange.NewPassword, _activeDirectoryStoreSettings);

                    await _signInManager.SignInAsync(response.IdentityUser, false);
                }
                else
                {
                    RegisterPasswordChangeErrors(passwordChange.UserName, passwordResult.Errors);
                }

                return Json(SerializationHelper.ToJsonResult(passwordResult));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PasswordController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Retrieves the Password Policy for the specified application area.
        /// </summary>
        /// <param name="passwordPolicy">The password policy.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Password/Policy")]
        public JsonResult Policy([FromBody] PasswordPolicyModel passwordPolicy)
        {
            try
            {
                AppPasswordPolicy appPasswordPolicy = null;

                if (passwordPolicy.AppArea == "Profile")
                    passwordPolicy.AppArea = string.Empty;

                if (!string.IsNullOrEmpty(passwordPolicy.AppArea))
                {
                    AppAreaName appAreaNameValid = (AppAreaName)Enum.Parse(typeof(AppAreaName), passwordPolicy.AppArea);
                    if (!string.IsNullOrEmpty(appAreaNameValid.ToString()))
                        appPasswordPolicy = _appPasswordPolicyService.Get(_settingHelper.GetApplicationId(), appAreaNameValid);
                }
                else
                {
                    appPasswordPolicy = _appPasswordPolicyService.GetByUser(_settingHelper.GetApplicationId(), User.Identity.Name);
                }

                if (appPasswordPolicy != null)
                    return Json(SerializationHelper.ToJsonResult(appPasswordPolicy.ToViewModel()));

                return Json(SerializationHelper.ToJsonResult(null, null, 0, true));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PasswordController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Policies the by user identifier.
        /// </summary>
        /// <param name="passwordPolicy">The password policy.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Password/PolicyByUserId")]
        public async Task<JsonResult> PolicyByUserId([FromBody] PasswordPolicyModel passwordPolicy)
        {
            try
            {
                AppUser appUser = await _appUserService.Get(passwordPolicy.AppUserId);
                AppPasswordPolicy appPasswordPolicy
                    = _appPasswordPolicyService.GetByUser(_settingHelper.GetApplicationId(), appUser.UserName);

                return Json(SerializationHelper.ToJsonResult(appPasswordPolicy.ToViewModel()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PasswordController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Policies the name of the by user.
        /// </summary>
        /// <param name="passwordPolicy">The password policy.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Password/PolicyByUserName")]
        public JsonResult PolicyByUserName([FromBody] PasswordPolicyModel passwordPolicy)
        {
            try
            {
                AppPasswordPolicy appPasswordPolicy = _appPasswordPolicyService.GetByUser(_settingHelper.GetApplicationId(), passwordPolicy.UserName);

                return Json(SerializationHelper.ToJsonResult(appPasswordPolicy.ToViewModel()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PasswordController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Recovers the password for a specific user, for the received username
        /// </summary>
        /// <param name="passwordChange">The password change.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Password/Recover")]
        public async Task<JsonResult> Recover([FromBody] PasswordChangeModel passwordChange)
        {
            try
            {
                PasswordResult passwordResult = null;
                if (!string.IsNullOrEmpty(passwordChange?.RecoveryCode) && passwordChange.RecoveryCode.Trim() != string.Empty)
                {
                    string recoveryCode = Encoding.UTF8.GetString(Convert.FromBase64String(passwordChange.RecoveryCode));
                    string[] recoveryCodeParts = recoveryCode.Split('/');
                    int appPasswordRecoveryRequestId = int.Parse(recoveryCodeParts[0]);
                    int appUserId = int.Parse(recoveryCodeParts[1]);
                    passwordResult = await _appUserService.RecoverPasswordAsync(appUserId, passwordChange.NewPassword, appPasswordRecoveryRequestId, _activeDirectoryStoreSettings);
                    if (!passwordResult.UpdatedSuccessfully)
                        RegisterPasswordChangeErrors(passwordChange.UserName, passwordResult.Errors);
                }
                return Json(SerializationHelper.ToJsonResult(passwordResult));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PasswordController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Password recovery process
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("Password/Recovery/{token}")]
        public async Task<ActionResult> Recovery(Guid token)
        {
            try
            {
                AppPasswordRecoveryRequest appPasswordRecoveryRequest = _appPasswordRecoveryRequestService.Get(token);
                if (appPasswordRecoveryRequest != null)
                {
                    AppUser appUser = await _appUserService.Get(appPasswordRecoveryRequest.AppUserId);
                    if (appUser != null)
                    {
                        if (Account?.PersonId > 0 || Account?.TemporaryUserId > 0)
                        {
                            TempData[Constants._signOutValidationTempData] = SerializationHelper.ToJsonObject(new SignOutValidationViewModel
                            {
                                IsSameUser = Account.UserName == appUser.UserName,
                                LoggedUserName = Account.UserName,
                                RedirectLocation = SignOutRedirectLocation.RecoverPassword,
                                Token = token
                            });
                            return RedirectToAction("SignOutConfirmation", "Home");
                        }
                        else
                        {
                            TempData[Constants._passwordRecoveryRequestTempData] = SerializationHelper.ToJsonObject(appPasswordRecoveryRequest);
                            return RedirectToAction("RecoverPassword", "Home");
                        }
                    }
                    else
                    {
                        _logger.LogError(Constants._product, typeof(HomeController).FullName, "AppUser was not found");
                    }
                }
                else
                {
                    return RedirectToAction("InvalidToken", "Errors");
                }

                return RedirectToAction("Error500", "Errors");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(HomeController).FullName, exception.Message, exception);
                return RedirectToAction("Error500", "Errors");
            }
        }

        /// <summary>
        /// Validates the specified password.
        /// </summary>
        /// <param name="passwordModel">The password model.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Password/Validate")]
        public async Task<JsonResult> Validate([FromBody] PasswordModel passwordModel)
        {
            try
            {
                PasswordResult passwordResult = null;

                if (!string.IsNullOrEmpty(passwordModel?.AreaName))
                {
                    AppAreaName appAreaNameValid = (AppAreaName)Enum.Parse(typeof(AppAreaName), passwordModel.AreaName);
                    if (!string.IsNullOrEmpty(appAreaNameValid.ToString()))
                    {
                        passwordResult = await _appUserService.IsValidPasswordAsync(_settingHelper.GetApplicationId(),
                            appAreaNameValid, passwordModel.Password);
                    }
                }

                return Json(SerializationHelper.ToJsonResult(passwordResult));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PasswordController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #region Private Methods

        /// <summary>
        /// Registers the password change errors.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <param name="errors">The errors.</param>
        private void RegisterPasswordChangeErrors(string userName, List<PasswordValidation> errors)
        {
            StringBuilder errorDetail = new();
            foreach (PasswordValidation passwordValidation in errors)
                errorDetail.Append(passwordValidation.ToString());
            _logger.LogError(Constants._product, typeof(PasswordController).FullName,
                $"Password change attempt failed for {userName}. Errors: {errorDetail} ");
        }

        #endregion Private Methods
    }
}