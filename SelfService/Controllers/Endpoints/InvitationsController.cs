// --------------------------------------------------------------------
// <copyright file="InvitationsController.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Administration.Models.Enum;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Account;
using SelfService.Models.Enum;
using SelfService.Models.Invitations;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using RoleQueue = Hedtech.PowerCampus.Core.DTO.Foundation.RoleQueue;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// InvitationsController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class InvitationsController : BaseEndpointController
    {
        /// <summary>
        /// The application area creation mode service
        /// </summary>
        private readonly IAppAreaCreationModeService _appAreaCreationModeService;

        /// <summary>
        /// The application area service
        /// </summary>
        private readonly IAppAreaService _appAreaService;

        /// <summary>
        /// The application store service
        /// </summary>
        private readonly IAppStoreService _appStoreService;

        /// <summary>
        /// The application user service
        /// </summary>
        private readonly IAppUserService _appUserService;

        /// <summary>
        /// The identity service
        /// </summary>
        private readonly IIdentityService _identityService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The invitation service
        /// </summary>
        private readonly IInvitationService _invitationService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<InvitationsController> _logger;

        /// <summary>
        /// The name format service
        /// </summary>
        private readonly INameFormatService _nameFormatService;

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
        /// The picture helper
        /// </summary>
        private readonly IPictureHelper _pictureHelper;

        /// <summary>
        /// The role queue service
        /// </summary>
        private readonly IRoleQueueService _roleQueueService;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="InvitationsController"/> class.
        /// </summary>
        /// <param name="appAreaCreationModeService">The application area creation mode service.</param>
        /// <param name="appAreaService">The application area service.</param>
        /// <param name="appStoreService">The application store service.</param>
        /// <param name="appUserService">The application user service.</param>
        /// <param name="identityService">The identity service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="invitationService">The invitation service.</param>
        /// <param name="nameFormatService">The name format service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="personService">The person service.</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="roleQueueService">The role queue service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="logger">The logger.</param>
        public InvitationsController(
            IAppAreaCreationModeService appAreaCreationModeService,
            IAppAreaService appAreaService,
            IAppStoreService appStoreService,
            IAppUserService appUserService,
            IIdentityService identityService,
            IInstitutionSettingService institutionSettingService,
            IInvitationService invitationService,
            INameFormatService nameFormatService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            IPersonService personService,
            IPictureHelper pictureHelper,
            IRoleQueueService roleQueueService,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            IAppLogger<InvitationsController> logger)
            : base(serializationHelper)
        {
            _appAreaCreationModeService = appAreaCreationModeService;
            _appAreaService = appAreaService;
            _appStoreService = appStoreService;
            _appUserService = appUserService;
            _identityService = identityService;
            _institutionSettingService = institutionSettingService;
            _invitationService = invitationService;
            _nameFormatService = nameFormatService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _personService = personService;
            _pictureHelper = pictureHelper;
            _roleQueueService = roleQueueService;
            _settingHelper = settingHelper;

            _logger = logger;
        }

        #region Invitations

        /// <summary>
        /// Deletes the specified invitation identifier.
        /// </summary>
        /// <param name="invitationId">The invitation identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Invitations/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileSharedAccess } })]
        public JsonResult Delete([FromBody] int invitationId)
        {
            try
            {
                bool result = _invitationService.Delete(invitationId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Detailses this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Invitations/Details")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileSharedAccess } })]
        public JsonResult Details()
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                string currentNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.General);
                string currentNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.General);
                bool showMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.General);
                InstitutionSettings.StudentRecords studentRecords = _institutionSettingService.GetStudentRecords();
                List<RelativeViewModel> invitations = _invitationService.GetRequestByStudent(Account.PersonId)
                    .ToViewModel(currentNameFormat, currentNameSort, _peopleService, false, showMiddleNameInitial, general.DateTimeCulture, _pictureHelper);
                List<RelativeViewModel> confirmations = _invitationService.GetRelativesByStudent(Account.PersonId)
                    .ToViewModel(currentNameFormat, currentNameSort, _peopleService, studentRecords.ShowStudentPicture, showMiddleNameInitial
                    , general.DateTimeCulture, _pictureHelper);

                return Json(SerializationHelper.ToJsonResult(new
                {
                    invitations,
                    confirmations
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Disclosures the statement.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Invitations/DisclosureStatement")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileSharedAccess } })]
        public JsonResult DisclosureStatement()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetSharedAccess().DisclosureStatement));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Indexes this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Invitations")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileSharedAccess } })]
        public async Task<JsonResult> Index()
        {
            try
            {
                InstitutionSettings.SharedAccess sharedAccess = _institutionSettingService.GetSharedAccess();
                bool hasSettings = sharedAccess.DaysInvitationExpires > 0 && !string.IsNullOrEmpty(sharedAccess.DisclosureStatement) && sharedAccess.DefaultEmailType > 0;
                bool hasGrant = HasGeneralProfileSharedAccessClaims();
                bool hasRelatives = _invitationService.GetStudentRelatives(Account.PersonId).Count > 0
                    || _invitationService.GetRequestByStudent(Account.PersonId).Count > 0
                    || _invitationService.GetRelativesByStudent(Account.PersonId).Count > 0;
                bool hasNotificationOn = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.SharedAccessInvitationCreated);
                string roleName = await _identityService.GetSharedAccessRoleNameAsync();
                bool hasSharedAccessRoleOn = !string.IsNullOrEmpty(roleName);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    hasGrant,
                    hasNotificationOn,
                    hasRelatives,
                    hasSettings,
                    hasSharedAccessRoleOn
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Retrieves the Relative details.
        /// </summary>
        /// <param name="relativeId">The relative identifier.</param>
        /// <returns></returns>
        [Route("Invitations/Relatives/Options")]
        [HttpPost]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileSharedAccess } })]
        public JsonResult RelativeOptions([FromBody] int relativeId)
        {
            try
            {
                RelativeDetailsViewModel relative = null;
                bool hasGrant = false;
                SharedAccessClaimModel claims = null;
                if (_invitationService.IsValidStudent(relativeId, Account.PersonId))
                {
                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    hasGrant = HasGeneralProfileSharedAccessClaims();
                    if (hasGrant)
                    {
                        claims = GetGeneralProfileSharedAccessClaims();
                        InvitationDetail invitationDetail = _invitationService.Get(Account.PersonId, relativeId);

                        string currentNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.General);
                        string currentNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.General);
                        bool showMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.General);
                        if (invitationDetail != null)
                            relative = invitationDetail.ToViewModel(currentNameFormat, currentNameSort, showMiddleNameInitial, general.DateTimeCulture);
                    }
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    hasGrant,
                    claims,
                    relative
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Updates the relative options.
        /// </summary>
        /// <param name="invitation">The invitation.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Invitations/Relatives/Options/Update")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileSharedAccess } })]
        public JsonResult RelativeOptionsUpdate([FromBody] Invitation invitation)
        {
            try
            {
                bool result = false;
                if (invitation != null && HasGeneralProfileSharedAccessClaims())
                    result = _invitationService.Update(invitation);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified invitation.
        /// </summary>
        /// <param name="invitation">The invitation.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Invitations/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileSharedAccess } })]
        public async Task<JsonResult> Save([FromBody] Invitation invitation)
        {
            try
            {
                bool result = false;
                if (invitation != null)
                {
                    string roleName = string.Empty;
                    bool hasNotificationOn = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.SharedAccessInvitationCreated).ConfigureAwait(false);
                    int appAreaId = _appAreaService.GetAppAreaId(_settingHelper.GetApplicationId(), AppAreaName.SharedAccess);
                    AppAreaCreationMode area = _appAreaCreationModeService.GetByAppAreaId(appAreaId)[0];
                    roleName = area.DefaultRoleName;

                    if (hasNotificationOn)
                    {
                        InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                        CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                        InstitutionSettings.SharedAccess sharedAccess = _institutionSettingService.GetSharedAccess();
                        DateTime date = DateTime.Now.Date;
                        invitation.RequestDate = date;
                        invitation.ExpiryDate = date.AddDays(sharedAccess.DaysInvitationExpires);
                        invitation.RequestToken = Guid.NewGuid();
                        if (invitation.StudentId == 0)
                            invitation.StudentId = Account.PersonId;
                        result = _invitationService.Create(invitation);
                        if (result)
                        {
                            string baseAddress = Request.PathBase.Value;
                            if (baseAddress.EndsWith("/"))
                                baseAddress = baseAddress.Length > 1 ? baseAddress[0..^2] : string.Empty;
                            string host = Request.Host.Value;
                            string confirmationUrl = $"{Request.Scheme}://{host}{baseAddress}/Invitations/Confirmation/{invitation.RequestToken}";
                            _ = _notificationsHelper.SendAsync(invitation.StudentId, invitation.RelationId, InvitationStatus.Created, confirmationUrl,
                                FormatHelper.ToShortDate(invitation.ExpiryDate, datetimeCulture), invitation.Email);
                            await CreateRoleQueueAsync(invitation.RelationId, roleName);
                        }
                    }
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Updates the status.
        /// </summary>
        /// <param name="invitationStatusModel">The invitation status model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Invitations/UpdateStatus")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileSharedAccess } })]
        public async Task<JsonResult> UpdateStatus([FromBody] InvitationStatusModel invitationStatusModel)
        {
            try
            {
                int invitationId = invitationStatusModel.InvitationId;
                int relativeId = invitationStatusModel.RelativeId;
                bool result = _invitationService.UpdateStatus(invitationId);
                string roleName = string.Empty;
                if (result && _invitationService.GetRelativesByStudent(invitationId).Count == 0)
                {
                    _ = _notificationsHelper.SendAsync(Account.PersonId, relativeId, InvitationStatus.Removed, string.Empty, string.Empty, string.Empty);
                    roleName = await _identityService.GetSharedAccessRoleNameAsync();
                    RoleQueue roleQueue = new()
                    {
                        Action = "D", // (A)dd or (D)elete
                        CreateById = Account.PersonId,
                        PersonId = relativeId,
                        SectionName = roleName,
                    };
                    _roleQueueService.Create(roleQueue);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Invitations

        #region Invitations Shared Access

        /// <summary>
        /// Retrieves the available options for the specific studenId only when the option has granted by claim and database permission.
        /// </summary>
        /// <param name="studentId">The student identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Invitations/Students/Options")]
        public JsonResult StudentOptions([FromBody] int studentId)
        {
            try
            {
                SharedAccessClaimModel sharedAccessOptions = new();
                if (studentId > 0)
                {
                    SharedAccess sharedAccess = new();
                    sharedAccess = _invitationService.GetRelativeSharedAccess(Account.PersonId, studentId);
                    if (sharedAccess != null)
                    {
                        IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity)?.Claims;
                        sharedAccessOptions = new SharedAccessClaimModel
                        {
                            AcademicPlan = claims.Any(c => c.Type == ClaimsConstants.SharedAccessStudentsAcademicPlan) && sharedAccess.CanViewAcaPlan,
                            ActivityGrades = claims.Any(c => c.Type == ClaimsConstants.SharedAccessStudentsActivityGrades) && sharedAccess.CanViewAssignmentGradeReport,
                            Address = claims.Any(c => c.Type == ClaimsConstants.SharedAccessStudentsAddress) && sharedAccess.CanViewAddress,
                            Balance = claims.Any(c => c.Type == ClaimsConstants.SharedAccessStudentsBalance) && sharedAccess.CanViewBalance,
                            FinancialAid = claims.Any(c => c.Type == ClaimsConstants.SharedAccessStudentsFinancialAid) && sharedAccess.CanViewFinAid,
                            GradeReport = claims.Any(c => c.Type == ClaimsConstants.SharedAccessStudentsGradeReport) && sharedAccess.CanViewGradeReport,
                            Schedule = claims.Any(c => c.Type == ClaimsConstants.SharedAccessStudentsSchedule) && sharedAccess.CanViewSchedule,
                            StopList = claims.Any(c => c.Type == ClaimsConstants.SharedAccessStudentsStopList) && sharedAccess.CanViewStopList,
                            Transcript = claims.Any(c => c.Type == ClaimsConstants.SharedAccessStudentsTranscript) && sharedAccess.CanViewTranscript
                        };
                    }
                }
                return Json(SerializationHelper.ToJsonResult(sharedAccessOptions));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// The list of students for the shared access once the invitation is confirmed
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Invitations/Students")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Students()
        {
            try
            {
                List<AvatarViewModel> students = null;
                IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity)?.Claims;
                bool hasSharedAccess = claims.Any(c => c.Type == ClaimsConstants.SharedAccessStudentsAcademicPlan
                   || c.Type == ClaimsConstants.SharedAccessStudentsActivityGrades
                   || c.Type == ClaimsConstants.SharedAccessStudentsAddress
                   || c.Type == ClaimsConstants.SharedAccessStudentsBalance
                   || c.Type == ClaimsConstants.SharedAccessStudentsFinancialAid
                   || c.Type == ClaimsConstants.SharedAccessStudentsGradeReport
                   || c.Type == ClaimsConstants.SharedAccessStudentsSchedule
                   || c.Type == ClaimsConstants.SharedAccessStudentsStopList
                   || c.Type == ClaimsConstants.SharedAccessStudentsTranscript);

                if (hasSharedAccess)
                {
                    List<People> studentsByRelative = _invitationService.GetStudentsByRelative(Account.PersonId);
                    InstitutionSettings.StudentRecords studentRecords = _institutionSettingService.GetStudentRecords();
                    students = studentsByRelative.ToViewModel(CurrentNameFormat, CurrentNameSort, _peopleService, studentRecords.ShowStudentPicture, ShowMiddleNameInitial, _pictureHelper);
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    hasSharedAccess,
                    students
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Invitations Shared Access

        #region Invitations Confirmation

        /// <summary>
        /// Confirms the invitation by the specified token.
        /// </summary>
        /// <param name="token">The token.</param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("Invitations/Confirmation/{token}")]
        public ActionResult Confirmation(Guid token)
        {
            try
            {
                InstitutionSettings.SharedAccess setting = _institutionSettingService.GetSharedAccess();
                bool applyPrimaryEmail = setting.ApplyPrimaryEmail;
                bool result = false;
                bool hasAccount = false;
                string fullName = string.Empty;

                People people = null;
                Invitation invitationRequest = _invitationService.GetByToken(token);
                if (invitationRequest != null)
                {
                    string username = _personService.GetUserNameByPersonId(invitationRequest.RelationId);
                    if (Account?.PersonId > 0)
                    {
                        string loggedUserName = Account.UserName;
                        bool isSameUserName = loggedUserName == username;

                        TempData[Constants._signOutValidationTempData] = SerializationHelper.ToJsonObject(new SignOutValidationViewModel
                        {
                            IsSameUser = isSameUserName,
                            LoggedUserName = loggedUserName,
                            RedirectLocation = SignOutRedirectLocation.InvitationConfirmation,
                            Token = token
                        });
                        return RedirectToAction("SignOutConfirmation", "Home");
                    }
                    if (invitationRequest.ExpiryDate.HasValue && invitationRequest.ExpiryDate.Value.Date < DateTime.Now.Date)
                        return RedirectToAction("ExpiredInvitation", "Errors");

                    string currentNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.General);
                    bool showMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.General);

                    hasAccount = username != null;
                    people = _peopleService.Get(invitationRequest.RelationId);
                    fullName = people.ToViewModel(currentNameFormat, showMiddleNameInitial).Description;
                    if (hasAccount)
                    {
                        result = _invitationService.CreateConfirmation(invitationRequest);
                        if (result)
                        {
                            EmailAddress emailAddress = _peopleService.GetEmailAddress(invitationRequest.RelationId, invitationRequest.Email);
                            if (emailAddress == null)
                                _peopleService.CreateEmailAddress(invitationRequest.RelationId, setting.DefaultEmailType, invitationRequest.Email, applyPrimaryEmail);
                            else
                            {
                                if (!emailAddress.IsPrimary && applyPrimaryEmail)
                                    _peopleService.UpdatePrimaryEmailAddress(emailAddress.PeopleCodeId, emailAddress.EmailAddressId);
                                if (!emailAddress.IsActive)
                                    _peopleService.UpdateEmailAddressStatus(emailAddress.EmailAddressId);
                            }

                            _ = _notificationsHelper.SendAsync(
                                invitationRequest.StudentId, invitationRequest.RelationId, InvitationStatus.Accepted, string.Empty, string.Empty, string.Empty);
                        }
                        else
                            return RedirectToAction("Error500", "Errors");
                    }

                    AccountInvitationViewModel accountInvitation = new()
                    {
                        FullName = fullName,
                        HasAccount = hasAccount,
                        UserName = username
                    };
                    if (people != null && !hasAccount)
                    {
                        accountInvitation.FirstName = people.FirstName;
                        accountInvitation.LastName = people.LastName;
                        accountInvitation.Email = people.Email;
                        accountInvitation.PersonId = people.PersonId;
                        accountInvitation.Token = token;
                        accountInvitation.PeopleId = people.PeopleId;
                    }
                    TempData[Constants._accountInvitationTempData] = SerializationHelper.ToJsonObject(accountInvitation);
                    return RedirectToAction("AccountConfirmation", "Home");
                }
                return RedirectToAction("InvalidInvitation", "Errors");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return RedirectToAction("Error500", "Errors");
            }
        }

        #endregion Invitations Confirmation

        #region Profile Shared Access Claims

        /// <summary>
        /// The claims for Profile Shared Access
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Invitations/Options")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileSharedAccess } })]
        public JsonResult Options()
        {
            try
            {
                IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity)?.Claims;
                InstitutionSettings.SharedAccess sharedAccess = _institutionSettingService.GetSharedAccess();
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                string currentNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.General);
                string currentNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.General);
                bool showMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.General);
                bool hasGrantAcademicPlan = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantAcademicPlan);
                bool hasGrantActivityGrades = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantActivityGrades);
                bool hasGrantAddress = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantAddress);
                bool hasGrantBalance = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantBalance);
                bool hasGrantFinancialAid = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantFinancialAid);
                bool hasGrantGradeReport = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantGradeReport);
                bool hasGrantSchedule = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantSchedule);
                bool hasGrantStopList = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantStopList);
                bool hasGrantTranscript = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantTranscript);
                string expirationDate = FormatHelper.ToShortDate(DateTime.Now.AddDays(sharedAccess.DaysInvitationExpires), datetimeCulture);
                List<ListOptionViewModel> relatives = _invitationService.GetStudentRelatives(Account.PersonId).ToOptionViewModel(currentNameFormat, currentNameSort, showMiddleNameInitial);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    hasGrantAcademicPlan,
                    hasGrantActivityGrades,
                    hasGrantAddress,
                    hasGrantBalance,
                    hasGrantFinancialAid,
                    hasGrantGradeReport,
                    hasGrantSchedule,
                    hasGrantStopList,
                    hasGrantTranscript,
                    expirationDate,
                    relatives
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InvitationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Profile Shared Access Claims

        #region Private Methods

        /// <summary>
        /// Creates the role queue asynchronous.
        /// </summary>
        /// <param name="relationId">The relation identifier.</param>
        /// <param name="roleName">Name of the role.</param>
        private async Task CreateRoleQueueAsync(int relationId, string roleName)
        {
            string username;
            AppUser user = null;
            username = _personService.GetUserNameByPersonId(relationId);
            if (username != null)
                user = await _appUserService.Get(username);
            if (user != null && !await _appUserService.IsInRole(user.Id, roleName) &&
                !_roleQueueService.Exists(relationId, roleName, "A"))
            {
                RoleQueue roleQueue = new()
                {
                    Action = "A", // (A)dd or (D)elete
                    CreateById = Account.PersonId,
                    PersonId = relationId,
                    SectionName = roleName,
                };
                _roleQueueService.Create(roleQueue);
            }
        }

        /// <summary>
        /// Gets the general profile shared access claims.
        /// </summary>
        /// <returns></returns>
        private SharedAccessClaimModel GetGeneralProfileSharedAccessClaims()
        {
            IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity)?.Claims;

            return new SharedAccessClaimModel
            {
                AcademicPlan = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantAcademicPlan),
                ActivityGrades = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantActivityGrades),
                Address = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantAddress),
                Balance = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantBalance),
                FinancialAid = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantFinancialAid),
                GradeReport = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantGradeReport),
                Schedule = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantSchedule),
                StopList = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantStopList),
                Transcript = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantTranscript)
            };
        }

        /// <summary>
        /// Determines whether [has general profile shared access claims].
        /// </summary>
        /// <returns>
        ///   <c>true</c> if [has general profile shared access claims]; otherwise, <c>false</c>.
        /// </returns>
        private bool HasGeneralProfileSharedAccessClaims()
        {
            IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity)?.Claims;
            return claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantAcademicPlan
               || c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantActivityGrades
               || c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantAddress
               || c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantBalance
               || c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantFinancialAid
               || c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantGradeReport
               || c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantSchedule
               || c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantStopList
               || c.Type == ClaimsConstants.GeneralProfileSharedAccessGrantTranscript);
        }

        #endregion Private Methods
    }
}