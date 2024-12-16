// --------------------------------------------------------------------
// <copyright file="AdviseesController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Account;
using SelfService.Models.Advisees;
using SelfService.Models.Pagination;
using SelfService.Models.Shared;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Advisees route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class AdviseesController : BaseEndpointController
    {
        /// <summary>
        /// The advisee service
        /// </summary>
        private readonly IAdviseeService _adviseeService;

        /// <summary>
        /// The advisee warning service
        /// </summary>
        private readonly IAdviseeWarningService _adviseeWarningService;

        /// <summary>
        /// The advising service
        /// </summary>
        private readonly IAdvisingService _advisingService;

        /// <summary>
        /// The institution setting filter service
        /// </summary>
        private readonly IInstitutionSettingFilterService _institutionSettingFilterService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<AdviseesController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The period service
        /// </summary>
        private readonly IPeriodService _periodService;

        /// <summary>
        /// The picture helper
        /// </summary>
        private readonly IPictureHelper _pictureHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="AdviseesController"/> class.
        /// </summary>
        /// <param name="adviseeService">The advisee service.</param>
        /// <param name="adviseeWarningService">The advisee warning service.</param>
        /// <param name="advisingService">The advising service.</param>
        /// <param name="institutionSettingFilterService">The institution setting filter service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="periodService">The period service.</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public AdviseesController(
            IAdviseeService adviseeService,
            IAdviseeWarningService adviseeWarningService,
            IAdvisingService advisingService,
            IInstitutionSettingFilterService institutionSettingFilterService,
            IInstitutionSettingService institutionSettingService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            IPeriodService periodService,
            IPictureHelper pictureHelper,
            ISerializationHelper serializationHelper,
            IAppLogger<AdviseesController> logger)
            : base(serializationHelper)
        {
            _adviseeService = adviseeService;
            _adviseeWarningService = adviseeWarningService;
            _advisingService = advisingService;
            _institutionSettingFilterService = institutionSettingFilterService;
            _institutionSettingService = institutionSettingService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _periodService = periodService;
            _pictureHelper = pictureHelper;

            _logger = logger;
        }

        #region My Advisees Warnings

        /// <summary>
        /// Get if personid has Attendance warning or not.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Advisees/{id}/AttendanceWarning")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult AttendanceWarning(int id)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(GetAttendanceWarning(id)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get if personid has grades warning or not.
        /// </summary>
        /// <param name="id">The person identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Advisees/{id}/GradeWarning")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult GradeWarning(int id)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(GetGradesWarning(id)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Profiles the claims.
        /// </summary>
        /// <param name="viewId">The view identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/Profile/Claims")]
        public JsonResult ProfileClaims([FromBody] int viewId)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(GetProfileClaims((AdviseeView)viewId)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get if personid has Violations or not.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Advisees/{id}/ViolationWarning")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult ViolationWarning(int id)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(GetViolationWarning(id)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get Warnings for the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ImpersonateAttribute), Arguments = new object[] { true })]
        public JsonResult Warnings([FromBody] ImpersonateModel model)
        {
            try
            {
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;

                AdviseeWarningViewModel adviseeWarningViewModel = new()
                {
                    PersonId = personId,
                    HasAttendanceWarning = GetAttendanceWarning(personId),
                    HasGradesWarning = GetGradesWarning(personId),
                    HasViolationWarning = GetViolationWarning(personId)
                };
                return Json(SerializationHelper.ToJsonResult(adviseeWarningViewModel));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion My Advisees Warnings

        #region Authorize Registration

        /// <summary>
        /// Deletes the authorize registration.
        /// </summary>
        /// <param name="authorizeRegistrations">The authorize registrations.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/AuthorizeRegistration/Delete")]
        public JsonResult DeleteAuthorizeRegistration([FromBody] List<AuthorizeRegistrationModel> authorizeRegistrations)
        {
            try
            {
                List<bool> results = new();
                if (authorizeRegistrations?.Count > 0)
                {
                    authorizeRegistrations.ForEach(a =>
                    {
                        results.Add(_advisingService.DeleteAuthorizationRegistration(
                        new AuthorizeRegistration
                        {
                            AuthorizingId = a.AuthorizationRegistrationId.Value,
                            SessionPeriodId = a.SessionPeriodId,
                            StudentId = a.PersonId
                        }));
                    });
                    if (results?.Count > 0 && !results.Contains(false))
                        return Json(SerializationHelper.ToJsonResult(authorizeRegistrations));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the authorization registration.
        /// </summary>
        /// <param name="authorizeRegistrations">The authorize registrations.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/AuthorizeRegistration/Save")]
        public JsonResult SaveAuthorizationRegistration([FromBody] List<AuthorizeRegistrationModel> authorizeRegistrations)
        {
            try
            {
                if (authorizeRegistrations?.Count > 0)
                {
                    authorizeRegistrations.ForEach(a =>
                   {
                       a.AuthorizationRegistrationId = _advisingService.SaveAuthorizationRegistration(
                             new AuthorizeRegistration
                             {
                                 AuthorizingId = Account.PersonId,
                                 SessionPeriodId = a.SessionPeriodId,
                                 StudentId = a.PersonId
                             }
                         );
                       _ = SendNotificationAsync(a.PersonId, a.SessionPeriodId);
                   });
                }
                return Json(SerializationHelper.ToJsonResult(authorizeRegistrations));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Authorize Registration

        #region Attendance

        /// <summary>
        /// Get Attendance for the specified person identifier in the specified Term Period
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException">model</exception>
        [HttpPost]
        [Route("Advisees/Attendance")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult Attendance([FromBody] TermPeriodPeopleModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                int termPeriodId = model.TermPeriodId;
                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                List<AdviseeAttendance> adviseeAttendance = _adviseeService.GetAttendance(personId, termPeriodId);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(adviseeAttendance.ToViewModel(_institutionSettingService, general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get attendance details for the specified transcriptDetailId
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException">model</exception>
        [HttpPost]
        [Route("Advisees/Attendance/Details")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult AttendanceDetails([FromBody] AttendanceDetailsRequestModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                List<AdviseeAttendanceDetail> adviseeAttendanceDetails = _adviseeService.GetAttendanceDetails(model.TranscriptDetailId);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(adviseeAttendanceDetails.ToViewModel(general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Attendance

        #region Manage Advisees

        /// <summary>
        /// Basics the search.
        /// </summary>
        /// <param name="adviseeSearchModel">The advisee search model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/BasicSearch")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult BasicSearch([FromBody] AdviseeBasicSearchModel adviseeSearchModel)
        {
            try
            {
                if (adviseeSearchModel.StartIndex < 0)
                    return Json(SerializationHelper.ToJsonResult(null, "startIndex is less than zero.", 404, false));
                if (adviseeSearchModel.Length <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "length is less than or equal to zero.", 404, false));

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.StudentRecords studentRecords = _institutionSettingService.GetStudentRecords();
                string formatPeopleId = general.PeopleIdFormat;

                if (adviseeSearchModel.SessionPeriodId != null)
                {
                    if (HasViewClaim(User.Claims, adviseeSearchModel.View, true))
                    {
                        AuthorizeRegistrationListViewModel authorizeRegistrationListViewModel =
                            _adviseeService.GetAuthorizeRegistrationBasic(Account.PersonId, adviseeSearchModel.Keyword, adviseeSearchModel.View,
                                adviseeSearchModel.StartIndex.Value, adviseeSearchModel.Length.Value, adviseeSearchModel.SessionPeriodId.Value)
                            .ToAuthorizeRegistrationViewModel(CurrentNameFormat, CurrentNameSort, formatPeopleId, studentRecords.ShowStudentPicture, _peopleService,
                            ShowMiddleNameInitial, _pictureHelper);
                        return Json(SerializationHelper.ToJsonResult(authorizeRegistrationListViewModel));
                    }
                }
                else
                {
                    if (HasViewClaim(User.Claims, adviseeSearchModel.View, false))
                    {
                        MyAdviseesListViewModel adviseesListViewModel =
                        _adviseeService.GetManageAdviseesBasic(Account.PersonId, adviseeSearchModel.Keyword, adviseeSearchModel.View,
                                adviseeSearchModel.StartIndex.Value, adviseeSearchModel.Length.Value)
                             .ToViewModel(CurrentNameFormat, CurrentNameSort, _peopleService, _institutionSettingService, studentRecords.ShowStudentPicture,
                             ShowMiddleNameInitial, _pictureHelper);
                        return Json(SerializationHelper.ToJsonResult(adviseesListViewModel));
                    }
                }

                _logger.LogWarning(Constants._product, typeof(AdviseesController).FullName,
                    $"Permission Evaluation - Failed: User {Account.UserName} tried to access to an unauthorized " +
                                        $"advisees view {adviseeSearchModel.View}");
                return Json(SerializationHelper.ToJsonResult(null, null, 403, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes my shared advisee.
        /// </summary>
        /// <param name="advisees">The advisees.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/MyShared/Delete")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public async Task<JsonResult> DeleteMySharedAdvisee([FromBody] List<int> advisees)
        {
            try
            {
                bool result = false;
                if (advisees?.Count > 0)
                {
                    bool isActive = await ValidateNotificationAsync(NotificationEvent.AdvisingSharedAdviseeRemoved);
                    List<ShareAdvisees> sharedAdviseesList = null;
                    if (isActive)
                        sharedAdviseesList = _adviseeService.GetAdvisorsIdsSharingAdvisee(Account.PersonId, advisees);
                    result = _adviseeService.DeleteMySharedAdvisee(Account.PersonId, advisees);
                    if (isActive && result)
                        _ = SendShareAdviseesNotificationAsync(NotificationEvent.AdvisingSharedAdviseeRemoved,
                            false, null, sharedAdviseesList);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Searches the specified advisee advanced search.
        /// </summary>
        /// <param name="adviseeAdvancedSearch">The advisee advanced search.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/Search")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Search([FromBody] AdviseeAdvancedSearchModel adviseeAdvancedSearch)
        {
            try
            {
                if (adviseeAdvancedSearch.StartIndex < 0)
                    return Json(SerializationHelper.ToJsonResult(null, "startIndex is less than zero.", 404, false));
                if (adviseeAdvancedSearch.Length <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "length is less than or equal to zero.", 404, false));

                MyAdviseesListViewModel adviseesListViewModel;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.StudentRecords studentRecords = _institutionSettingService.GetStudentRecords();
                string formatPeopleId = general.PeopleIdFormat;
                if (adviseeAdvancedSearch.SessionPeriodId != null)
                {
                    AuthorizeRegistrationListViewModel authorizeRegistrationListViewModel =
                        _adviseeService.GetAuthorizeRegistrationAdvanced(Account.PersonId, adviseeAdvancedSearch.Criteria, adviseeAdvancedSearch.View,
                            (int)adviseeAdvancedSearch.StartIndex, (int)adviseeAdvancedSearch.Length, adviseeAdvancedSearch.Filter, adviseeAdvancedSearch.SessionPeriodId.Value)
                        .ToAuthorizeRegistrationViewModel(CurrentNameFormat, CurrentNameSort, formatPeopleId, studentRecords.ShowStudentPicture, _peopleService,
                        ShowMiddleNameInitial, _pictureHelper);
                    return Json(SerializationHelper.ToJsonResult(authorizeRegistrationListViewModel));
                }
                adviseesListViewModel = _adviseeService.GetManageAdviseesAdvanced(Account.PersonId, adviseeAdvancedSearch.Criteria, adviseeAdvancedSearch.View,
                    (int)adviseeAdvancedSearch.StartIndex, (int)adviseeAdvancedSearch.Length, adviseeAdvancedSearch.Filter)
                    .ToViewModel(CurrentNameFormat, CurrentNameSort, _peopleService, _institutionSettingService, studentRecords.ShowStudentPicture,
                    ShowMiddleNameInitial, _pictureHelper);
                return Json(SerializationHelper.ToJsonResult(adviseesListViewModel));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the Search Option Dropdowns for Advanced Advisees Search
        /// </summary>
        /// <param name="view">The view.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/Search/Options")]
        public JsonResult SearchOptions([FromBody] AdviseeView view)
        {
            try
            {
                IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity)?.Claims;
                List<AdviseeSearchOptions> options = _advisingService.GetSearchOptions(Account.PersonId, view);
                AdviseeSearchOptionViewModel AdviseeSearchOption = options.ToViewModel();
                AdviseeSearchOption.HasScheduleRequestsClaim = GetClaim(claims, "ScheduleRequests", view);
                return Json(SerializationHelper.ToJsonResult(AdviseeSearchOption));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        #endregion Manage Advisees

        #region Claims

        /// <summary>
        /// Claims the settings.
        /// </summary>
        /// <param name="adviseeClaimSettingsModel">The advisee claim settings model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/ClaimSettings")]
        public JsonResult ClaimSettings([FromBody] AdviseeClaimSettingsModel adviseeClaimSettingsModel)
        {
            try
            {
                AdviseeView view = adviseeClaimSettingsModel.View;
                bool isAuthorizeRegistration = adviseeClaimSettingsModel.IsAuthorizeRegistration;
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity)?.Claims;
                AdviseeClaimSettingModel adviseeClaimSetting = new()
                {
                    HasDossierClaim = GetClaim(claims, "Dossier", view, isAuthorizeRegistration),
                    EmailSettings = new EmailSettingsViewModel
                    {
                        CanEditRecipient = mail.CanEditRecipient,
                        CanEditSender = mail.CanEditSender,
                        Email = mail.Email,
                        EmailProvider = mail.EmailProvider,
                        Sender = mail.Sender,
                        StaffSeparator = mail.StaffSeparator,
                        StaffUrl = mail.StaffUrl,
                        StudentSeparator = mail.StudentSeparator,
                        StudentUrl = mail.StudentUrl
                    }
                };
                if (!isAuthorizeRegistration)
                {
                    adviseeClaimSetting.HasAttendanceClaim = GetClaim(claims, "Attendance", view);
                    adviseeClaimSetting.HasGradeReportClaim = GetClaim(claims, "GradeReport", view);
                    adviseeClaimSetting.HasProfileClaim = GetClaim(claims, "Profile", view);
                    adviseeClaimSetting.HasScheduleClaim = GetClaim(claims, "Schedule", view);
                    adviseeClaimSetting.HasScheduleRequestsClaim = GetClaim(claims, "ScheduleRequests", view);
                    if (view != AdviseeView.MySharedAdvisees)
                        adviseeClaimSetting.HasShareClaim = GetClaim(claims, "Share", view);
                }
                return Json(SerializationHelper.ToJsonResult(adviseeClaimSetting));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Claims

        #region Shared Advisees

        /// <summary>
        /// Deletes the shared advisee advisor.
        /// </summary>
        /// <param name="sharedAdvisee">The shared advisee.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/SharedAdvisees/DeleteAdvisor")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult DeleteSharedAdviseeAdvisor([FromBody] ShareAdvisees sharedAdvisee)
        {
            try
            {
                bool result = false;
                if (sharedAdvisee?.SharedAdviseeId > 0)
                {
                    result = _adviseeService.DeleteSharedAdviseeAdvisor(sharedAdvisee.SharedAdviseeId);
                    if (result)
                    {
                        _ = SendShareAdviseesNotificationAsync(NotificationEvent.AdvisingSharedAdvisorRemoved, true, sharedAdvisee);
                    }
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the shared advisees.
        /// </summary>
        /// <param name="advisees">The advisees.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/SharedAdvisees/Delete")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public async Task<JsonResult> DeleteSharedAdvisees([FromBody] List<int> advisees)
        {
            try
            {
                bool result = false;
                if (advisees?.Count > 0)
                {
                    bool isActive = await ValidateNotificationAsync(NotificationEvent.AdvisingSharedAdvisorRemoved);
                    List<ShareAdvisees> sharedAdviseesList = null;
                    if (isActive)
                        sharedAdviseesList = _adviseeService.GetAdvisorsIdsForSharedAdvisee(Account.PersonId, advisees);
                    result = _adviseeService.DeleteSharedAdvisees(Account.PersonId, advisees);
                    if (isActive && result)
                        _ = SendShareAdviseesNotificationAsync(NotificationEvent.AdvisingSharedAdvisorRemoved,
                            false, null, sharedAdviseesList);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the advisors with whom the current advisee id has been shared.
        /// </summary>
        /// <param name="id">The identifier of the advisee that has been shared</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/Advisors")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult GetAdvisors([FromBody] int id)
        {
            try
            {
                List<SharedAdvisee> advisorsList = _adviseeService.GetAdvisorsForSharedAdvisee(Account.PersonId, id);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.StudentRecords studentRecords = _institutionSettingService.GetStudentRecords();

                return Json(SerializationHelper.ToJsonResult(new
                {
                    advisors = advisorsList.ToViewModel(CurrentNameFormat, CurrentNameSort,
                        _peopleService, general.PeopleIdFormat, studentRecords.ShowStudentPicture, ShowMiddleNameInitial, _pictureHelper),
                    id
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the shared advisees.
        /// </summary>
        /// <param name="paginationModel">The pagination model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/Shared")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult GetSharedAdvisees([FromBody] PaginationModel paginationModel)
        {
            try
            {
                int startIndex = paginationModel.StartIndex.Value;
                int length = paginationModel.Length.Value;
                AdviseesSharedViewModel adviseesSharedViewModel = null;
                if (startIndex >= 0 && length > 0)
                {
                    List<StudentShared> studentsShared = _adviseeService.GetSharedAdviseesByAdvisor(Account.PersonId, startIndex, length);
                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    InstitutionSettings.StudentRecords studentRecords = _institutionSettingService.GetStudentRecords();
                    adviseesSharedViewModel = studentsShared.ToViewModel(CurrentNameFormat, CurrentNameSort, _peopleService, general.PeopleIdFormat,
                        studentRecords.ShowStudentPicture, ShowMiddleNameInitial, _pictureHelper);
                }
                return Json(SerializationHelper.ToJsonResult(adviseesSharedViewModel));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Shares advisees with the selected advisor
        /// </summary>
        /// <param name="shareAdvisees">The share advisees.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Advisees/Share")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Share([FromBody] ShareAdvisees shareAdvisees)
        {
            try
            {
                bool result = _advisingService.SaveSharedAdvisees(shareAdvisees, Account.PersonId);
                _ = SendShareAdviseesNotificationAsync(NotificationEvent.AdvisingAdviseeShared, true, shareAdvisees);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Shared Advisees

        #region Private Methods

        /// <summary>
        /// Gets all students claim.
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="claimName">Name of the claim.</param>
        /// <param name="isAuthorizeRegistration">if set to <c>true</c> [is authorize registration].</param>
        /// <returns></returns>
        private bool GetAllStudentsClaim(IEnumerable<Claim> claims, string claimName, bool isAuthorizeRegistration)
        {
            bool claim = false;
            switch (claimName)
            {
                #region All Students Options

                case "Dossier":
                    claim = isAuthorizeRegistration ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesAllStudentsDossier) :
                        claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsDossier);
                    break;

                case "Profile":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfile);
                    break;

                case "ScheduleRequests":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileScheduleRequests);
                    break;

                case "Schedule":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileSchedule);
                    break;

                case "GradeReport":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileGradeReport);
                    break;

                case "Attendance":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileAttendance);
                    break;

                case "Share":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsShare);
                    break;

                    #endregion All Students Options
            }
            return claim;
        }

        /// <summary>
        /// Gets the alumni claim.
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="claimName">Name of the claim.</param>
        /// <param name="isAuthorizeRegistration">if set to <c>true</c> [is authorize registration].</param>
        /// <returns></returns>
        private bool GetAlumniClaim(IEnumerable<Claim> claims, string claimName, bool isAuthorizeRegistration)
        {
            bool claim = false;
            switch (claimName)
            {
                case "Dossier":
                    claim = isAuthorizeRegistration ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesAlumniDossier) :
                        claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniDossier);
                    break;

                case "Profile":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfile);
                    break;

                case "ScheduleRequests":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileScheduleRequests);
                    break;

                case "Schedule":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileSchedule);
                    break;

                case "GradeReport":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileGradeReport);
                    break;

                case "Attendance":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileAttendance);
                    break;

                case "Share":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniShare);
                    break;
            }
            return claim;
        }

        /// <summary>
        /// Gets the attendance warning.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        private bool GetAttendanceWarning(int id)
        {
            try
            {
                InstitutionSettings.AdvisorWarning settings = _institutionSettingService.GetAdvisorWarnings();
                bool hasAttendance = false;
                if (settings.ShowAttendance)
                {
                    hasAttendance = _adviseeWarningService.HasAttendanceWarning(id, settings.ExcusedAbsences, settings.UnexcusedAbsences,
                          settings.ExcusedTardiness, settings.UnexcusedTardiness);
                }
                return hasAttendance;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return false;
            }
        }

        /// <summary>
        /// Gets the claim.
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="claimName">Name of the claim.</param>
        /// <param name="view">The view.</param>
        /// <param name="isAuthorizeRegistration">if set to <c>true</c> [is authorize registration].</param>
        /// <returns></returns>
        private bool GetClaim(IEnumerable<Claim> claims, string claimName, AdviseeView view, bool isAuthorizeRegistration = false)
        {
            bool claim = false;
            switch (view)
            {
                case AdviseeView.MyAdvisees:
                    claim = GetMyAdviseesClaim(claims, claimName, isAuthorizeRegistration);
                    break;

                case AdviseeView.MyStudents:
                    claim = GetMyStudentsClaim(claims, claimName, isAuthorizeRegistration);
                    break;

                case AdviseeView.MyAssociations:
                    claim = GetMyAssociationsClaim(claims, claimName, isAuthorizeRegistration);
                    break;

                case AdviseeView.AllStudents:
                    claim = GetAllStudentsClaim(claims, claimName, isAuthorizeRegistration);
                    break;

                case AdviseeView.FormerAdvisees:
                    claim = GetFormerAdviseesClaim(claims, claimName, isAuthorizeRegistration);
                    break;

                case AdviseeView.Alumni:
                    claim = GetAlumniClaim(claims, claimName, isAuthorizeRegistration);
                    break;

                case AdviseeView.MyDepartment:
                    claim = GetMyDepartmentClaim(claims, claimName, isAuthorizeRegistration);
                    break;

                case AdviseeView.MyCampus:
                    claim = GetMyCampusClaim(claims, claimName, isAuthorizeRegistration);
                    break;

                case AdviseeView.MySharedAdvisees:
                    claim = GetMySharedAdviseesClaim(claims, claimName, isAuthorizeRegistration);
                    break;
            }
            return claim;
        }

        /// <summary>
        /// Gets the former advisees claim.
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="claimName">Name of the claim.</param>
        /// <param name="isAuthorizeRegistration">if set to <c>true</c> [is authorize registration].</param>
        /// <returns></returns>
        private bool GetFormerAdviseesClaim(IEnumerable<Claim> claims, string claimName, bool isAuthorizeRegistration)
        {
            bool claim = false;
            switch (claimName)
            {
                case "Dossier":
                    claim = isAuthorizeRegistration ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesFormerAdviseesDossier) :
                        claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesDossier);
                    break;

                case "Profile":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfile);
                    break;

                case "ScheduleRequests":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileScheduleRequests);
                    break;

                case "Schedule":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileSchedule);
                    break;

                case "GradeReport":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileGradeReport);
                    break;

                case "Attendance":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileAttendance);
                    break;

                case "Share":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesShare);
                    break;
            }
            return claim;
        }

        /// <summary>
        /// Gets the grades warning.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        private bool GetGradesWarning(int id)
        {
            try
            {
                InstitutionSettings.AdvisorWarning settings = _institutionSettingService.GetAdvisorWarnings();
                bool hasGrades = false;
                if (settings.ShowGrades)
                {
                    Collection<string> grades = new();
                    List<InstitutionSettingFilter> gradesFilter = _institutionSettingFilterService.GetGrades();
                    gradesFilter.ForEach(grade => grades.Add(grade.Description));
                    hasGrades = _adviseeWarningService.HasGradesWarning(id, grades);
                }

                return hasGrades;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return false;
            }
        }

        /// <summary>
        /// Gets my advisees claim.
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="claimName">Name of the claim.</param>
        /// <param name="isAuthorizeRegistration">if set to <c>true</c> [is authorize registration].</param>
        /// <returns></returns>
        private bool GetMyAdviseesClaim(IEnumerable<Claim> claims, string claimName, bool isAuthorizeRegistration)
        {
            bool claim = false;
            switch (claimName)
            {
                case "Dossier":
                    claim = isAuthorizeRegistration ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyAdviseesDossier) :
                        claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesDossier);
                    break;

                case "Profile":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfile);
                    break;

                case "ScheduleRequests":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileScheduleRequests);
                    break;

                case "Schedule":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileSchedule);
                    break;

                case "GradeReport":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileGradeReport);
                    break;

                case "Attendance":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileAttendance);
                    break;

                case "Share":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesShare);
                    break;
            }
            return claim;
        }

        /// <summary>
        /// Gets my associations claim.
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="claimName">Name of the claim.</param>
        /// <param name="isAuthorizeRegistration">if set to <c>true</c> [is authorize registration].</param>
        /// <returns></returns>
        private bool GetMyAssociationsClaim(IEnumerable<Claim> claims, string claimName, bool isAuthorizeRegistration)
        {
            bool claim = false;
            switch (claimName)
            {
                case "Dossier":
                    claim = isAuthorizeRegistration ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyAssociationsDossier) :
                        claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsDossier);
                    break;

                case "Profile":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfile);
                    break;

                case "ScheduleRequests":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileScheduleRequests);
                    break;

                case "Schedule":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileSchedule);
                    break;

                case "GradeReport":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileGradeReport);
                    break;

                case "Attendance":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileAttendance);
                    break;

                case "Share":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsShare);
                    break;
            }
            return claim;
        }

        /// <summary>
        /// Gets my campus claim.
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="claimName">Name of the claim.</param>
        /// <param name="isAuthorizeRegistration">if set to <c>true</c> [is authorize registration].</param>
        /// <returns></returns>
        private bool GetMyCampusClaim(IEnumerable<Claim> claims, string claimName, bool isAuthorizeRegistration)
        {
            bool claim = false;
            switch (claimName)
            {
                case "Dossier":
                    claim = isAuthorizeRegistration ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyCampusDossier) :
                        claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusDossier);
                    break;

                case "Profile":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfile);
                    break;

                case "ScheduleRequests":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileScheduleRequests);
                    break;

                case "Schedule":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileSchedule);
                    break;

                case "GradeReport":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileGradeReport);
                    break;

                case "Attendance":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileAttendance);
                    break;

                case "Share":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusShare);
                    break;
            }
            return claim;
        }

        /// <summary>
        /// Gets my department claim.
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="claimName">Name of the claim.</param>
        /// <param name="isAuthorizeRegistration">if set to <c>true</c> [is authorize registration].</param>
        /// <returns></returns>
        private bool GetMyDepartmentClaim(IEnumerable<Claim> claims, string claimName, bool isAuthorizeRegistration)
        {
            bool claim = false;
            switch (claimName)
            {
                case "Dossier":
                    claim = isAuthorizeRegistration ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyDepartmentDossier) :
                        claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentDossier);
                    break;

                case "Profile":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfile);
                    break;

                case "ScheduleRequests":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileScheduleRequests);
                    break;

                case "Schedule":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileSchedule);
                    break;

                case "GradeReport":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileGradeReport);
                    break;

                case "Attendance":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileAttendance);
                    break;

                case "Share":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentShare);
                    break;
            }
            return claim;
        }

        /// <summary>
        /// Gets my shared advisees claim.
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="claimName">Name of the claim.</param>
        /// <param name="isAuthorizeRegistration">if set to <c>true</c> [is authorize registration].</param>
        /// <returns></returns>
        private bool GetMySharedAdviseesClaim(IEnumerable<Claim> claims, string claimName, bool isAuthorizeRegistration)
        {
            bool claim = false;
            switch (claimName)
            {
                case "Dossier":
                    claim = isAuthorizeRegistration ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMySharedAdviseesDossier) :
                        claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesDossier);
                    break;

                case "Profile":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfile);
                    break;

                case "ScheduleRequests":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileScheduleRequests);
                    break;

                case "Schedule":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileSchedule);
                    break;

                case "GradeReport":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileGradeReport);
                    break;

                case "Attendance":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileAttendance);
                    break;
            }
            return claim;
        }

        /// <summary>
        /// Gets my students claim.
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="claimName">Name of the claim.</param>
        /// <param name="isAuthorizeRegistration">if set to <c>true</c> [is authorize registration].</param>
        /// <returns></returns>
        private bool GetMyStudentsClaim(IEnumerable<Claim> claims, string claimName, bool isAuthorizeRegistration)
        {
            bool claim = false;
            switch (claimName)
            {
                case "Dossier":
                    claim = isAuthorizeRegistration ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyStudentsDossier) :
                        claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsDossier);
                    break;

                case "Profile":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfile);
                    break;

                case "ScheduleRequests":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileScheduleRequests);
                    break;

                case "Schedule":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileSchedule);
                    break;

                case "GradeReport":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileGradeReport);
                    break;

                case "Attendance":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAttendance);
                    break;

                case "Share":
                    claim = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsShare);
                    break;
            }
            return claim;
        }

        /// <summary>
        /// Gets the profile claims.
        /// </summary>
        /// <param name="viewId">The view identifier.</param>
        /// <returns></returns>
        private AdviseeClaimModel GetProfileClaims(AdviseeView viewId)
        {
            IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity).Claims;
            AdviseeClaimModel adviseeClaims = new();
            switch (viewId)
            {
                case AdviseeView.MyAdvisees:
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfile);
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileScheduleRequests);
                    adviseeClaims.Schedule = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileSchedule);
                    adviseeClaims.GradeReport = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileGradeReport);
                    adviseeClaims.GradeReportCoursework = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileGradeReportCoursework);
                    adviseeClaims.AcademicPlan = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileAcademicPlan);
                    adviseeClaims.AcademicPlanAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileAcademicPlanAddToCart);
                    adviseeClaims.UnofficialTranscript = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileUnofficialTranscript);
                    adviseeClaims.Agreements = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileAgreements);
                    adviseeClaims.Checklist = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileChecklist);
                    adviseeClaims.ChecklistCreateActionItem = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileChecklistCreateActionItem);
                    adviseeClaims.Disabilities = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileDisabilities);
                    adviseeClaims.TestScores = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileTestScores);
                    adviseeClaims.Attendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileAttendance);
                    adviseeClaims.AttendanceDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileAttendanceDailyAttendance);
                    adviseeClaims.WhatIf = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileWhatIf);
                    adviseeClaims.WhatIfAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileWhatIfAddToCart);
                    adviseeClaims.Alerts = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileAlerts);
                    adviseeClaims.RegistrationSummary = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesProfileRegistrationSummary);
                    break;

                case AdviseeView.MyStudents:
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfile);
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileScheduleRequests);
                    adviseeClaims.Schedule = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileSchedule);
                    adviseeClaims.GradeReport = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileGradeReport);
                    adviseeClaims.GradeReportCoursework = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileGradeReportCoursework);
                    adviseeClaims.AcademicPlan = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAcademicPlan);
                    adviseeClaims.AcademicPlanAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAcademicPlanAddToCart);
                    adviseeClaims.UnofficialTranscript = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileUnofficialTranscript);
                    adviseeClaims.Agreements = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAgreements);
                    adviseeClaims.Checklist = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileChecklist);
                    adviseeClaims.ChecklistCreateActionItem = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileChecklistCreateActionItem);
                    adviseeClaims.Disabilities = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileDisabilities);
                    adviseeClaims.TestScores = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileTestScores);
                    adviseeClaims.Attendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAttendance);
                    adviseeClaims.AttendanceDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAttendanceDailyAttendance);
                    adviseeClaims.WhatIf = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileWhatIf);
                    adviseeClaims.WhatIfAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAcademicPlanAddToCart);
                    adviseeClaims.Alerts = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileAlerts);
                    adviseeClaims.RegistrationSummary = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsProfileRegistrationSummary);
                    break;

                case AdviseeView.MyAssociations:
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfile);
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileScheduleRequests);
                    adviseeClaims.Schedule = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileSchedule);
                    adviseeClaims.GradeReport = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileGradeReport);
                    adviseeClaims.GradeReportCoursework = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileGradeReportCoursework);
                    adviseeClaims.AcademicPlan = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileAcademicPlan);
                    adviseeClaims.AcademicPlanAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileAcademicPlanAddToCart);
                    adviseeClaims.UnofficialTranscript = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileUnofficialTranscript);
                    adviseeClaims.Agreements = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileAgreements);
                    adviseeClaims.Checklist = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileChecklist);
                    adviseeClaims.ChecklistCreateActionItem = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileChecklistCreateActionItem);
                    adviseeClaims.Disabilities = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileDisabilities);
                    adviseeClaims.TestScores = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileTestScores);
                    adviseeClaims.Attendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileAttendance);
                    adviseeClaims.AttendanceDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileAttendanceDailyAttendance);
                    adviseeClaims.WhatIf = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileWhatIf);
                    adviseeClaims.WhatIfAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileWhatIfAddToCart);
                    adviseeClaims.Alerts = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileAlerts);
                    adviseeClaims.RegistrationSummary = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsProfileRegistrationSummary);
                    break;

                case AdviseeView.AllStudents:
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfile);
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileScheduleRequests);
                    adviseeClaims.Schedule = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileSchedule);
                    adviseeClaims.GradeReport = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileGradeReport);
                    adviseeClaims.GradeReportCoursework = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileGradeReportCoursework);
                    adviseeClaims.AcademicPlan = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileAcademicPlan);
                    adviseeClaims.AcademicPlanAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileAcademicPlanAddToCart);
                    adviseeClaims.UnofficialTranscript = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileUnofficialTranscript);
                    adviseeClaims.Agreements = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileAgreements);
                    adviseeClaims.Checklist = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileChecklist);
                    adviseeClaims.ChecklistCreateActionItem = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileChecklistCreateActionItem);
                    adviseeClaims.Disabilities = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileDisabilities);
                    adviseeClaims.TestScores = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileTestScores);
                    adviseeClaims.Attendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileAttendance);
                    adviseeClaims.AttendanceDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileAttendanceDailyAttendance);
                    adviseeClaims.WhatIf = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileWhatIf);
                    adviseeClaims.WhatIfAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileWhatIfAddToCart);
                    adviseeClaims.Alerts = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileAlerts);
                    adviseeClaims.RegistrationSummary = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsProfileRegistrationSummary);
                    break;

                case AdviseeView.FormerAdvisees:
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfile);
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileScheduleRequests);
                    adviseeClaims.Schedule = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileSchedule);
                    adviseeClaims.GradeReport = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileGradeReport);
                    adviseeClaims.GradeReportCoursework = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileGradeReportCoursework);
                    adviseeClaims.AcademicPlan = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileAcademicPlan);
                    adviseeClaims.AcademicPlanAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileAcademicPlanAddToCart);
                    adviseeClaims.UnofficialTranscript = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileUnofficialTranscript);
                    adviseeClaims.Agreements = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileAgreements);
                    adviseeClaims.Checklist = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileChecklist);
                    adviseeClaims.ChecklistCreateActionItem = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileChecklistCreateActionItem);
                    adviseeClaims.Disabilities = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileDisabilities);
                    adviseeClaims.TestScores = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileTestScores);
                    adviseeClaims.Attendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileAttendance);
                    adviseeClaims.AttendanceDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileAttendanceDailyAttendance);
                    adviseeClaims.WhatIf = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileWhatIf);
                    adviseeClaims.WhatIfAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileWhatIfAddToCart);
                    adviseeClaims.Alerts = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileAlerts);
                    adviseeClaims.RegistrationSummary = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesProfileRegistrationSummary);
                    break;

                case AdviseeView.Alumni:
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfile);
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileScheduleRequests);
                    adviseeClaims.Schedule = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileSchedule);
                    adviseeClaims.GradeReport = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileGradeReport);
                    adviseeClaims.GradeReportCoursework = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileGradeReportCoursework);
                    adviseeClaims.AcademicPlan = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileAcademicPlan);
                    adviseeClaims.AcademicPlanAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileAcademicPlanAddToCart);
                    adviseeClaims.UnofficialTranscript = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileUnofficialTranscript);
                    adviseeClaims.Agreements = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileAgreements);
                    adviseeClaims.Checklist = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileChecklist);
                    adviseeClaims.ChecklistCreateActionItem = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileChecklistCreateActionItem);
                    adviseeClaims.Disabilities = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileDisabilities);
                    adviseeClaims.TestScores = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileTestScores);
                    adviseeClaims.Attendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileAttendance);
                    adviseeClaims.AttendanceDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileAttendanceDailyAttendance);
                    adviseeClaims.WhatIf = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileWhatIf);
                    adviseeClaims.WhatIfAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileWhatIfAddToCart);
                    adviseeClaims.Alerts = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileAlerts);
                    adviseeClaims.RegistrationSummary = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniProfileRegistrationSummary);
                    break;

                case AdviseeView.MyDepartment:
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfile);
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileScheduleRequests);
                    adviseeClaims.Schedule = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileSchedule);
                    adviseeClaims.GradeReport = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileGradeReport);
                    adviseeClaims.GradeReportCoursework = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileGradeReportCoursework);
                    adviseeClaims.AcademicPlan = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileAcademicPlan);
                    adviseeClaims.AcademicPlanAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileAcademicPlanAddToCart);
                    adviseeClaims.UnofficialTranscript = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileUnofficialTranscript);
                    adviseeClaims.Agreements = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileAgreements);
                    adviseeClaims.Checklist = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileChecklist);
                    adviseeClaims.ChecklistCreateActionItem = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileChecklistCreateActionItem);
                    adviseeClaims.Disabilities = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileDisabilities);
                    adviseeClaims.TestScores = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileTestScores);
                    adviseeClaims.Attendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileAttendance);
                    adviseeClaims.AttendanceDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileAttendanceDailyAttendance);
                    adviseeClaims.WhatIf = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileWhatIf);
                    adviseeClaims.WhatIfAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileWhatIfAddToCart);
                    adviseeClaims.Alerts = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileAlerts);
                    adviseeClaims.RegistrationSummary = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentProfileRegistrationSummary);
                    break;

                case AdviseeView.MyCampus:
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfile);
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileScheduleRequests);
                    adviseeClaims.Schedule = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileSchedule);
                    adviseeClaims.GradeReport = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileGradeReport);
                    adviseeClaims.GradeReportCoursework = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileGradeReportCoursework);
                    adviseeClaims.AcademicPlan = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileAcademicPlan);
                    adviseeClaims.AcademicPlanAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileAcademicPlanAddToCart);
                    adviseeClaims.UnofficialTranscript = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileUnofficialTranscript);
                    adviseeClaims.Agreements = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileAgreements);
                    adviseeClaims.Checklist = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileChecklist);
                    adviseeClaims.ChecklistCreateActionItem = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileChecklistCreateActionItem);
                    adviseeClaims.Disabilities = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileDisabilities);
                    adviseeClaims.TestScores = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileTestScores);
                    adviseeClaims.Attendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileAttendance);
                    adviseeClaims.AttendanceDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileAttendanceDailyAttendance);
                    adviseeClaims.WhatIf = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileWhatIf);
                    adviseeClaims.WhatIfAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileWhatIfAddToCart);
                    adviseeClaims.Alerts = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileAlerts);
                    adviseeClaims.RegistrationSummary = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusProfileRegistrationSummary);
                    break;

                case AdviseeView.MySharedAdvisees:
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfile);
                    adviseeClaims.ScheduleRequests = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileScheduleRequests);
                    adviseeClaims.Schedule = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileSchedule);
                    adviseeClaims.GradeReport = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileGradeReport);
                    adviseeClaims.GradeReportCoursework = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileGradeReportCoursework);
                    adviseeClaims.AcademicPlan = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileAcademicPlan);
                    adviseeClaims.AcademicPlanAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileAcademicPlanAddToCart);
                    adviseeClaims.UnofficialTranscript = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileUnofficialTranscript);
                    adviseeClaims.Agreements = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileAgreements);
                    adviseeClaims.Checklist = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileChecklist);
                    adviseeClaims.ChecklistCreateActionItem = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileChecklistCreateActionItem);
                    adviseeClaims.Disabilities = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileDisabilities);
                    adviseeClaims.TestScores = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileTestScores);
                    adviseeClaims.Attendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileAttendance);
                    adviseeClaims.AttendanceDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileAttendanceDailyAttendance);
                    adviseeClaims.WhatIf = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileWhatIf);
                    adviseeClaims.WhatIfAddToCart = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileWhatIfAddToCart);
                    adviseeClaims.Alerts = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileAlerts);
                    adviseeClaims.RegistrationSummary = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdviseesProfileRegistrationSummary);
                    break;
            }
            return adviseeClaims;
        }

        /// <summary>
        /// Gets the violation warning.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        private bool GetViolationWarning(int id)
        {
            try
            {
                InstitutionSettings.AdvisorWarning settings = _institutionSettingService.GetAdvisorWarnings();
                bool hasViolations = false;
                if (settings.ShowViolations)
                {
                    List<int> violations = new();
                    settings.Violations = _institutionSettingFilterService.Get(InstitutionSettingFilterType.Violation);
                    if (settings.Violations != null)
                    {
                        settings.Violations.ForEach(violation => violations.Add(int.Parse(violation.Id)));
                        hasViolations = _adviseeWarningService.HasViolationWarning(id, violations);
                    }
                }

                return hasViolations;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return false;
            }
        }

        /// <summary>
        /// Determines if the user has the claim for the selected view
        /// </summary>
        /// <param name="claims">The claims.</param>
        /// <param name="view">The advisee view.</param>
        /// <param name="isAuthorizeRegistration">if set to <c>true</c> [is authorize registration].</param>
        /// <returns></returns>
        private bool HasViewClaim(IEnumerable<Claim> claims, AdviseeView view, bool isAuthorizeRegistration)
        {
            bool hasViewClaim = false;
            switch (view)
            {
                case AdviseeView.MyAdvisees:
                    hasViewClaim = isAuthorizeRegistration
                        ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyAdvisees)
                        : claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdvisees);
                    break;

                case AdviseeView.MyStudents:
                    hasViewClaim = isAuthorizeRegistration
                        ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyStudents)
                        : claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudents);
                    break;

                case AdviseeView.MyAssociations:
                    hasViewClaim = isAuthorizeRegistration
                        ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyAssociations)
                        : claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociations);
                    break;

                case AdviseeView.AllStudents:
                    hasViewClaim = isAuthorizeRegistration
                        ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesAllStudents)
                        : claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudents);
                    break;

                case AdviseeView.FormerAdvisees:
                    hasViewClaim = isAuthorizeRegistration
                        ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesFormerAdvisees)
                        : claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdvisees);
                    break;

                case AdviseeView.Alumni:
                    hasViewClaim = isAuthorizeRegistration
                        ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesAlumni)
                        : claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumni);
                    break;

                case AdviseeView.MyDepartment:
                    hasViewClaim = isAuthorizeRegistration
                        ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyDepartment)
                        : claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartment);
                    break;

                case AdviseeView.MyCampus:
                    hasViewClaim = isAuthorizeRegistration
                        ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyCampus)
                        : claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampus);
                    break;

                case AdviseeView.MySharedAdvisees:
                    hasViewClaim = isAuthorizeRegistration
                        ? claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMySharedAdvisees)
                        : claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdvisees);
                    break;
            }
            return hasViewClaim;
        }

        /// <summary>
        /// Sends the notification asynchronous.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <param name="sessionPeriodId">The session period identifier.</param>
        private async Task SendNotificationAsync(int personId, int sessionPeriodId)
        {
            bool isActive = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.AdvisingAuthorizeRegistration).ConfigureAwait(false);
            if (isActive && Account.PersonId > 0)
            {
                SessionPeriod sessionPeriod = _periodService.GetYearTermSesion(sessionPeriodId);
                People person = _peopleService.Get(personId);
                List<NotificationToken> currentTokens = new()
                {
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = person.Email } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.prefix", Value = person.Prefix } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.firstname", Value = person.FirstName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.displayname", Value = person.DisplayName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.middlename", Value = person.MiddleName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastname", Value = person.LastName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.suffix", Value = person.Suffix } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.nickname", Value = person.Nickname } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastnameprefix", Value = person.LastNamePrefix } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.legalname", Value = person.LegalName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "registrationauthorization.session", Value = sessionPeriod.SessionDesc } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "registrationauthorization.term", Value = sessionPeriod.TermDesc } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "registrationauthorization.year", Value = sessionPeriod.Year } },
                };
                _notificationsHelper.Create(new NotificationEventModel
                {
                    EventKey = NotificationEvent.AdvisingAuthorizeRegistration,
                    Tokens = currentTokens
                });
            }
            return;
        }

        /// <summary>
        /// Sends the share advisees notification asynchronous.
        /// </summary>
        /// <param name="notificationEvent">The notification event.</param>
        /// <param name="validateNotification">if set to <c>true</c> [validate notification].</param>
        /// <param name="sharedAdvisees">The shared advisees.</param>
        /// <param name="sharedAdviseesList">The shared advisees list.</param>
        private async Task SendShareAdviseesNotificationAsync(string notificationEvent, bool validateNotification,
            ShareAdvisees sharedAdvisees, List<ShareAdvisees> sharedAdviseesList = null)
        {
            try
            {
                if (validateNotification && !await ValidateNotificationAsync(notificationEvent))
                    return;

                if (sharedAdvisees != null)
                {
                    People advisor = _peopleService.Get(sharedAdvisees.AdvisorId);
                    if (string.IsNullOrEmpty(advisor.Email))
                        return;
                    List<NotificationToken> currentTokens = new()
                    {
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = advisor.Email } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.prefix", Value = advisor.Prefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.firstname", Value = advisor.FirstName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.displayname", Value = advisor.DisplayName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.middlename", Value = advisor.MiddleName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastname", Value = advisor.LastName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.suffix", Value = advisor.Suffix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.nickname", Value = advisor.Nickname } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastnameprefix", Value = advisor.LastNamePrefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.legalname", Value = advisor.LegalName } }
                    };

                    NotificationTokenDetail sharedAdviseesTokens = new()
                    {
                        Id = "sharedadvisees",
                        ValueList = new List<NotificationToken>()
                    };
                    People advisee;
                    Dictionary<string, string> nameParts;
                    foreach (int adviseeId in sharedAdvisees.StudentIds)
                    {
                        advisee = _peopleService.Get(adviseeId);
                        nameParts = FormatHelper.SetNamePartsToDictionary(
                            new string[]
                            {
                                advisee.Prefix,
                                advisee.FirstName,
                                advisee.MiddleName,
                                advisee.LastNamePrefix,
                                advisee.LastName,
                                advisee.DisplayName,
                                advisee.Pronoun,
                                advisee.Suffix
                            });

                        sharedAdviseesTokens.ValueList.Add(new NotificationToken
                        {
                            Token = new NotificationTokenDetail
                            {
                                Id = "sharedadvisee",
                                ValueList = new List<NotificationToken>
                                {
                                    new NotificationToken {
                                            Token = new NotificationTokenDetail {
                                            Id = "sharedadvisee.fullname",
                                            Value = FormatHelper.ToNameFormat(nameParts, CurrentNameFormat, ShowMiddleNameInitial)
                                        }
                                    }
                                }
                            }
                        });
                    }
                    currentTokens.Add(new NotificationToken { Token = sharedAdviseesTokens });

                    _notificationsHelper.Create(new NotificationEventModel
                    {
                        EventKey = notificationEvent,
                        Tokens = currentTokens
                    });
                }
                else if (sharedAdviseesList != null)
                {
                    foreach (ShareAdvisees shareadAdviseeAdvisor in sharedAdviseesList)
                        await SendShareAdviseesNotificationAsync(notificationEvent, false, shareadAdviseeAdvisor);
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
            }
        }

        /// <summary>
        /// Validates the notification asynchronous.
        /// </summary>
        /// <param name="notificationEvent">The notification event.</param>
        /// <returns></returns>
        private async Task<bool> ValidateNotificationAsync(string notificationEvent)
        {
            try
            {
                return await _notificationsHelper.EventIsActiveAsync(notificationEvent).ConfigureAwait(false);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AdviseesController).FullName, exception.Message, exception);
                return false;
            }
        }

        #endregion Private Methods
    }
}