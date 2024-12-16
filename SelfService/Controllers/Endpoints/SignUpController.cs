// --------------------------------------------------------------------
// <copyright file="SignUpController.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Logic;
using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Administration.Models.Enum;
using Hedtech.PowerCampus.Administration.Models.Settings;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Account;
using SelfService.Models.Enum;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TemporaryUser = Hedtech.PowerCampus.Core.DTO.Foundation.TemporaryUser;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /SignUp route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class SignUpController : BaseEndpointController
    {
        /// <summary>
        /// The active directory store settings
        /// </summary>
        private readonly List<ActiveDirectoryStoreSettings> _activeDirectoryStoreSettings;

        /// <summary>
        /// The application user service
        /// </summary>
        private readonly IAppUserService _appUserService;

        /// <summary>
        /// The InstitutionSetting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IInvitationService _invitationService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<SignUpController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The person service
        /// </summary>
        private readonly IPersonService _personService;

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
        /// Initializes a new instance of the <see cref="SignUpController"/> class.
        /// </summary>
        /// <param name="activeDirectoryStoreSettings">The active directory store settings.</param>
        /// <param name="signInManager">The sign in manager.</param>
        /// <param name="appUserService">The application user service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="invitationService">The invitation service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="personService">The person service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="logger">The logger.</param>
        public SignUpController(
            IOptions<List<ActiveDirectoryStoreSettings>> activeDirectoryStoreSettings,
            CustomSignInManager signInManager,
            IAppUserService appUserService,
            IInstitutionSettingService institutionSettingService,
            IInvitationService invitationService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            IPersonService personService,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            ITemporaryUserService temporaryUserService,
            IAppLogger<SignUpController> logger)
            : base(serializationHelper)
        {
            _activeDirectoryStoreSettings = activeDirectoryStoreSettings.Value;

            _signInManager = signInManager;

            _appUserService = appUserService;
            _institutionSettingService = institutionSettingService;
            _invitationService = invitationService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _personService = personService;
            _settingHelper = settingHelper;
            _temporaryUserService = temporaryUserService;

            _logger = logger;
        }

        /// <summary>
        /// Applications the specified account.
        /// </summary>
        /// <param name="account">The account.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("SignUp/Application")]
        public async Task<ActionResult> Application([FromBody] IdentityAccountViewModel account)
        {
            try
            {
                (ResultSignUpViewModel result, string logText) = await CreateAccount(account, AppAreaName.Application);
                int applicationId = _settingHelper.GetApplicationId();
                if (result.Status == 0 && result.UserName != null)
                {
                    _ = _notificationsHelper.SendAsync(account, result.UserName, "AdmissionsApplicationAccountCreated");

                    AuthResponse response = await _appUserService.Authenticate(applicationId, result.UserName, account.Password, _activeDirectoryStoreSettings);

                    await _signInManager.SignInAsync(response.IdentityUser, false);
                }
                return Json(SerializationHelper.ToJsonResult(result, logText));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SignUpController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Continuings the education sign up.
        /// </summary>
        /// <param name="account">The model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("SignUp/ConEd")]
        public async Task<JsonResult> ConEd([FromBody] IdentityAccountViewModel account)
        {
            try
            {
                (ResultSignUpViewModel result, string logText) = await CreateAccount(account, AppAreaName.ConEd);

                if (result.Status == 0)
                    _ = _notificationsHelper.SendAsync(account, result.UserName, "ConEdAccountCreated");

                return Json(SerializationHelper.ToJsonResult(result, logText));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SignUpController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the ReCaptcha settings for sign up.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("SignUp/RecaptchaSettings")]
        public JsonResult GetRecaptchaSettings()
        {
            try
            {
                bool isReCaptchaEnabled = false;
                string reCaptchaSiteKey = string.Empty;

                InstitutionSettings.ReCaptcha reCaptchaSettings = _institutionSettingService.GetReCaptcha();
                isReCaptchaEnabled = reCaptchaSettings.EnableCreateAccount;
                reCaptchaSiteKey = reCaptchaSettings.SiteKey;

                return Json(SerializationHelper.ToJsonResult(new
                {
                    isReCaptchaEnabled,
                    reCaptchaSiteKey
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Shareds the access.
        /// </summary>
        /// <param name="account">The account.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("SignUp/SharedAccess")]
        public async Task<JsonResult> SharedAccess([FromBody] IdentityAccountViewModel account)
        {
            try
            {
                (ResultSignUpViewModel result, string logText) = await CreateAccount(account, AppAreaName.SharedAccess);

                if (result.Status == 0)
                {
                    _ = _personService.CreatePersonUser(account.PersonId.Value, result.UserName, null);
                    _ = _notificationsHelper.SendAsync(account, result.UserName, "SharedAccessAccountCreated");
                    Invitation invitationRequest = _invitationService.GetByToken(account.Token.Value);
                    bool invitationResult = _invitationService.CreateConfirmation(invitationRequest);
                    if (invitationResult)
                    {
                        InstitutionSettings.SharedAccess setting = _institutionSettingService.GetSharedAccess();
                        bool applyPrimaryEmail = setting.ApplyPrimaryEmail;
                        EmailAddress emailAddress = _peopleService.GetEmailAddress(invitationRequest.RelationId, invitationRequest.Email);
                        if (emailAddress == null)
                        {
                            _peopleService.CreateEmailAddress(invitationRequest.RelationId, setting.DefaultEmailType, invitationRequest.Email, applyPrimaryEmail);
                        }
                        else
                        {
                            if (!emailAddress.IsPrimary && applyPrimaryEmail)
                                _peopleService.UpdatePrimaryEmailAddress(emailAddress.PeopleCodeId, emailAddress.EmailAddressId);
                            else if (!emailAddress.IsActive)
                                _peopleService.UpdateEmailAddressStatus(emailAddress.EmailAddressId);
                        }

                        _ = _notificationsHelper.SendAsync(invitationRequest.StudentId, invitationRequest.RelationId, InvitationStatus.Accepted, string.Empty, string.Empty, string.Empty);
                    }
                }

                return Json(SerializationHelper.ToJsonResult(result, logText));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SignUpController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #region Private Methods

        /// <summary>
        /// Creates the account.
        /// </summary>
        /// <param name="account">The account.</param>
        /// <param name="appAreaName">Name of the application area.</param>
        /// <returns></returns>
        private async Task<(ResultSignUpViewModel, string)> CreateAccount(IdentityAccountViewModel account, AppAreaName appAreaName)
        {
            ResultSignUpViewModel result = new();

            string logText = null;
            try
            {
                UserAccountStatus userAccountStatus;
                IdentityResult userAccountResult;
                IdentityResult passwordIdentityResult;

                AppUser appUserResult = new();
                int applicationId = _settingHelper.GetApplicationId();

                PasswordResult passwordResult = await _appUserService.IsValidPasswordAsync(applicationId, appAreaName, account.Password);

                if (passwordResult.IsValid)
                {
                    UserAccount userAccount = new()
                    {
                        ApplicationId = applicationId,
                        Email = account.Email,
                        FirstName = account.FirstName,
                        LastName = account.LastName,
                        Password = account.Password,
                        PeopleId = account.PeopleId
                    };

                    (userAccountResult, passwordIdentityResult, userAccountStatus, appUserResult)
                        = await _appUserService.CreateUserAccountByArea(userAccount, appAreaName, _activeDirectoryStoreSettings);

                    // Clean password for security
                    userAccount.Password = null;

                    if (userAccountResult == null)
                    {
                        result.Status = -1;
                        result.UserAccountStatus = (int)userAccountStatus;
                        logText += userAccountStatus;
                        return (result, logText);
                    }

                    if (userAccountResult.Succeeded)
                    {
                        result.Status = 0;
                        if (appAreaName != AppAreaName.SharedAccess)
                        {
                            if (_temporaryUserService.Get(appUserResult.UserName) != null)
                            {
                                logText = $"The username: {appUserResult.UserName} already exists in temporary user";
                                result.UserName = appUserResult.UserName;
                            }
                            else
                            {
                                int createResult = _temporaryUserService.Create(new TemporaryUser
                                {
                                    Email = userAccount.Email,
                                    FirstName = userAccount.FirstName,
                                    LastName = userAccount.LastName,
                                    UserName = appUserResult.UserName
                                }, (int)appAreaName);

                                if (createResult <= 0)
                                {
                                    result.Status = -1;
                                    logText = $"The username: {appUserResult.UserName} was created but the temporary user failed";
                                }
                                else
                                {
                                    result.UserName = appUserResult.UserName;
                                }
                            }
                        }
                        else
                        {
                            result.UserName = appUserResult.UserName;
                        }
                    }
                    else
                    {
                        result.Status = -1;
                        logText = $"{userAccountStatus}, Data={SerializationHelper.ToJsonObject(userAccount)}";
                    }
                }
                else
                {
                    result.Status = -1;
                    foreach (PasswordValidation error in passwordResult.Errors)
                        logText += error;
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SignUpController).FullName, exception.Message, exception);
            }
            return (result, logText);
        }

        #endregion Private Methods
    }
}