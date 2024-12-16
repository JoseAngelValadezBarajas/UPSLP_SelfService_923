// --------------------------------------------------------------------
// <copyright file="ScheduleController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

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
using SelfService.Models.Registration;
using SelfService.Models.Resources;
using SelfService.Models.Schedule;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Schedule route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class ScheduleController : BaseEndpointController
    {
        /// <summary>
        /// The academic service
        /// </summary>
        private readonly IAcademicService _academicService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<ScheduleController> _logger;

        /// <summary>
        /// The name format service
        /// </summary>
        private readonly INameFormatService _nameFormatService;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The registration service
        /// </summary>
        private readonly IRegistrationService _registrationService;

        /// <summary>
        /// The report helper
        /// </summary>
        private readonly IReportHelper _reportHelper;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The schedule request service
        /// </summary>
        private readonly IScheduleRequestService _scheduleRequestService;

        /// <summary>
        /// The schedule service
        /// </summary>
        private readonly IScheduleService _scheduleService;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// The temporary user service
        /// </summary>
        private readonly ITemporaryUserService _temporaryUserService;

        /// <summary>
        /// Initializes a new instance of the <see cref="ScheduleController"/> class.
        /// </summary>
        /// <param name="academicService">The academic service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="nameFormatService">The name format service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="registrationService">The registration service.</param>
        /// <param name="reportHelper">The report helper.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="scheduleRequestService">The schedule request service.</param>
        /// <param name="scheduleService">The schedule service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="logger">The logger.</param>
        public ScheduleController(
            IAcademicService academicService,
            IInstitutionSettingService institutionSettingService,
            INameFormatService nameFormatService,
            IPeopleService peopleService,
            IRegistrationService registrationService,
            IReportHelper reportHelper,
            IResourcesHelper resourcesHelper,
            IScheduleRequestService scheduleRequestService,
            IScheduleService scheduleService,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            ITemporaryUserService temporaryUserService,
            IAppLogger<ScheduleController> logger)
            : base(serializationHelper)
        {
            _academicService = academicService;
            _institutionSettingService = institutionSettingService;
            _nameFormatService = nameFormatService;
            _peopleService = peopleService;
            _registrationService = registrationService;
            _reportHelper = reportHelper;
            _resourcesHelper = resourcesHelper;
            _scheduleRequestService = scheduleRequestService;
            _scheduleService = scheduleService;
            _settingHelper = settingHelper;
            _temporaryUserService = temporaryUserService;

            _logger = logger;
        }

        /// <summary>
        /// Faculties the specified year term session.
        /// </summary>
        /// <param name="yearTermSession">The year term session.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Schedule/Faculty")]
        public JsonResult Faculty([FromBody] YearTermSessionModel yearTermSession)
        {
            try
            {
                if (yearTermSession?.Year > 0 && !string.IsNullOrEmpty(yearTermSession.Term))
                {
                    string staffNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.Staff);
                    string staffNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.Staff);
                    bool staffShowMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.Staff);
                    string dateTimeCultureFormat = _institutionSettingService.GetGeneral().DateTimeCulture;
                    ClassDetailFilter filter = new()
                    {
                        PersonId = Account.PersonId,
                        Term = yearTermSession.Term,
                        Session = yearTermSession.Session,
                        Year = yearTermSession.Year
                    };
                    List<FacultySessionClasses> facultySessionClassesList = _scheduleService.GetForFacultyBySession(filter);
                    List<FacultyScheduleBySessionViewModel> tradFacultySchedules
                        = facultySessionClassesList.ToViewModel(_institutionSettingService, staffNameFormat, staffNameSort, staffShowMiddleNameInitial, dateTimeCultureFormat);
                    return Json(SerializationHelper.ToJsonResult(tradFacultySchedules));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Faculties the con ed.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Schedule/FacultyConEd")]
        public JsonResult FacultyConEd()
        {
            try
            {
                string staffNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.Staff);
                string staffNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.Staff);
                bool staffShowMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.Staff);
                string dateTimeCultureFormat = _institutionSettingService.GetGeneral().DateTimeCulture;
                ClassDetailFilter filter = new()
                {
                    PersonId = Account.PersonId
                };
                List<ClassDetail> conEdClassDetails = _scheduleService.GetForFacultyConEd(filter);
                List<FacultyScheduleViewModel> conEdFacultySchedules = conEdClassDetails.ToViewModel(_institutionSettingService, staffNameFormat, staffNameSort, staffShowMiddleNameInitial, dateTimeCultureFormat);
                return Json(SerializationHelper.ToJsonResult(conEdFacultySchedules));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Faculties the report.
        /// </summary>
        /// <param name="conEdValue">The con ed value.</param>
        /// <param name="year">The year.</param>
        /// <param name="term">The term.</param>
        /// <param name="session">The session.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Schedule/FacultyReport/{conEdValue}/{year}/{term}/{session?}")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public ActionResult FacultyReport(int conEdValue, int year, string term, string session = null)
        {
            try
            {
                bool conEd = conEdValue == 1; // If 1, conEd is true
                YearTermSessionModel yearTermSession = new()
                {
                    Session = session,
                    Term = term,
                    Year = year
                };
                string staffNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.Staff);
                string staffNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.Staff);
                bool staffShowMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.Staff);
                string dateTimeCultureFormat = _institutionSettingService.GetGeneral().DateTimeCulture;
                List<FacultyScheduleBySessionViewModel> tradFacultySchedules = new();
                if (yearTermSession?.Year > 0 && !string.IsNullOrEmpty(yearTermSession.Term))
                {
                    ClassDetailFilter tradCoursesFilter = new()
                    {
                        PersonId = Account.PersonId,
                        Term = yearTermSession.Term,
                        Session = yearTermSession.Session,
                        Year = yearTermSession.Year
                    };
                    List<FacultySessionClasses> facultySessionClassesList = _scheduleService.GetForFacultyBySession(tradCoursesFilter);
                    tradFacultySchedules = facultySessionClassesList.ToViewModel(_institutionSettingService, staffNameFormat, staffNameSort, staffShowMiddleNameInitial, dateTimeCultureFormat);
                }
                List<FacultyScheduleViewModel> conEdFacultySchedules = null;
                if (conEd)
                {
                    ClassDetailFilter conEdCoursesFilter = new()
                    {
                        PersonId = Account.PersonId
                    };
                    List<ClassDetail> conEdClassDetails = _scheduleService.GetForFacultyConEd(conEdCoursesFilter);
                    conEdFacultySchedules = conEdClassDetails.ToViewModel(_institutionSettingService, staffNameFormat, staffNameSort, staffShowMiddleNameInitial, dateTimeCultureFormat);
                }

                People people = _peopleService.Get(Account.PersonId);
                string fullName = people.ToViewModel(staffNameFormat, staffNameSort, staffShowMiddleNameInitial).FullName;
                string period = year > 0 ? $"{year}/{term}{(session?.Length > 0 ? $"/{session}" : string.Empty)}" : string.Empty;
                string language = _settingHelper.GetLanguage(Account);
                byte[] report = _reportHelper.GetFacultySchedule(tradFacultySchedules, conEdFacultySchedules, fullName, period, conEd, language);
                return File(report, "application/pdf", "FacultyScheduleReport.pdf");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

        /// <summary>
        /// Gets the student traditional schedule.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException">model</exception>
        [HttpPost]
        [Route("Schedule/Student")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Student([FromBody] StudentScheduleModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                List<List<ClassDetail>> classDetails;
                if (model.YearTermSession != null)
                {
                    string formatCredits = _institutionSettingService.GetGeneral().Credits;
                    PeopleYearTermSessionModel peopleYearTermSession = new()
                    {
                        PersonId = personId,
                        Session = model.YearTermSession.Session,
                        Term = model.YearTermSession.Term,
                        Year = model.YearTermSession.Year
                    };
                    InstitutionSettings.Registration registrationSettings = _institutionSettingService.GetRegistration();
                    bool allowChangeOfCreditType = registrationSettings.AllowChangeOfCreditType;
                    ClassDetailFilter filter = new()
                    {
                        PersonId = peopleYearTermSession.PersonId,
                        CreditTypes = allowChangeOfCreditType,
                        Cart = true,
                        Denied = true,
                        Pending = true,
                        Waitlist = true,
                        Registered = true,
                        PermissionRequest = registrationSettings.EnableInstructorPermissionRequest,
                        RegisterForPendingCourses = registrationSettings.EnableRegisterForPendingCourses,
                        Term = peopleYearTermSession.Term,
                        Year = peopleYearTermSession.Year
                    };

                    (classDetails, _) = _scheduleService.GetForStudent(filter);
                    List<List<StudentScheduleViewModel>> scheduleStudentViewModel = classDetails.ToStudentViewModel(_institutionSettingService,
                        CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial);
                    List<Academic> studentAcademics =
                        _academicService.GetInformation(
                            peopleYearTermSession.PersonId, peopleYearTermSession.Year.ToString(), peopleYearTermSession.Term, peopleYearTermSession.Session);

                    List<SectionsSessionViewModel> sectionsSessionList = null;
                    SectionsSessionViewModel sectionsSessionViewModel = null;
                    if (scheduleStudentViewModel?.Count > 0)
                    {
                        sectionsSessionList = new List<SectionsSessionViewModel>();
                        if (!string.IsNullOrEmpty(peopleYearTermSession.Session))
                        {
                            sectionsSessionViewModel = new SectionsSessionViewModel
                            {
                                Session = peopleYearTermSession.Session,
                                Sections = new List<List<StudentScheduleViewModel>>()
                            };

                            List<StudentScheduleViewModel> tempList = null;
                            string sessionDesc = string.Empty;
                            foreach (List<StudentScheduleViewModel> list in scheduleStudentViewModel)
                            {
                                tempList = list.FindAll(s => s.Session == peopleYearTermSession.Session);
                                sectionsSessionViewModel.Sections.Add(tempList);
                                if (tempList?.Count > 0 && string.IsNullOrEmpty(sessionDesc))
                                    sessionDesc = tempList[0].SessionDesc;
                            }
                            sectionsSessionViewModel.SessionDesc = sessionDesc;
                            sectionsSessionList.Add(sectionsSessionViewModel);
                        }
                        else
                        {
                            for (int j = 0; j < scheduleStudentViewModel.Count; j++)
                            {
                                for (int i = 0; i < scheduleStudentViewModel[j].Count; i++)
                                {
                                    sectionsSessionViewModel = sectionsSessionList.Find(s => s.Session == scheduleStudentViewModel[j][i].Session);
                                    if (sectionsSessionViewModel == null)
                                    {
                                        sectionsSessionViewModel = new()
                                        {
                                            Session = scheduleStudentViewModel[j][i].Session,
                                            SessionDesc = scheduleStudentViewModel[j][i].SessionDesc,
                                            Sections = new List<List<StudentScheduleViewModel>>()
                                        };
                                        for (int z = 0; z < 5; z++)
                                            sectionsSessionViewModel.Sections.Add(new List<StudentScheduleViewModel>());
                                        sectionsSessionList.Add(sectionsSessionViewModel);
                                    }
                                    sectionsSessionViewModel.Sections[j].Add(scheduleStudentViewModel[j][i]);
                                }
                            }
                            sectionsSessionList = sectionsSessionList.OrderBy(s => s.Session).ToList();
                        }
                    }

                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        Schedule = sectionsSessionList,
                        AcademicInformation = studentAcademics.ToViewModel(CurrentNameFormat, ShowMiddleNameInitial),
                        RegisteredCredits = FormatHelper.ToCredits(classDetails?[3]?.Count > 0 ? classDetails[3].Sum(x => x.Credits) : 0, formatCredits)
                    }));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the Student con ed schedule.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Schedule/StudentConEd")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult StudentConEd([FromBody] ImpersonateModel model)
        {
            try
            {
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;

                List<List<ClassDetail>> classDetails = GetConEdCourses(personId);
                List<List<StudentScheduleViewModel>> scheduleStudentViewModel = null;
                if (classDetails != null)
                    scheduleStudentViewModel = classDetails.ToStudentViewModel(_institutionSettingService, CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial);

                return Json(SerializationHelper.ToJsonResult(scheduleStudentViewModel));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Students the con ed courses.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult StudentConEdCourses()
        {
            try
            {
                List<List<ClassDetail>> classDetails = null;
                if (Account.PersonId > 0)
                    classDetails = GetConEdCourses(Account.PersonId);
                else if (Account.TemporaryUserId > 0)
                    classDetails = _temporaryUserService.GetSections(Account.TemporaryUserId);
                List<List<StudentScheduleViewModel>> scheduleStudentViewModel = null;
                if (classDetails != null)
                    scheduleStudentViewModel = classDetails.ToStudentViewModel(_institutionSettingService, CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial);
                return Json(SerializationHelper.ToJsonResult(scheduleStudentViewModel));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        ///  Retrieves the Schedule for the Student in the specific YearTerm
        /// </summary>
        /// <param name="yearTerm">The year term.</param>
        /// <returns>Task&lt;JsonResult&gt;.</returns>
        [HttpPost]
        [Route("Schedule/StudentCourses")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult StudentCourses([FromBody] YearTermModel yearTerm)
        {
            try
            {
                if (yearTerm?.Year > 0 && !string.IsNullOrEmpty(yearTerm.Term))
                {
                    InstitutionSettings.Registration registrationSettings = _institutionSettingService.GetRegistration();
                    bool allowChangeOfCreditType = registrationSettings.AllowChangeOfCreditType;
                    List<List<ClassDetail>> classDetails;
                    List<BlockClassDetail> blockClassDetails;
                    ClassDetailFilter filter = new()
                    {
                        BlockRegistration = true,
                        Cart = true,
                        CreditTypes = allowChangeOfCreditType,
                        Denied = true,
                        Pending = true,
                        PermissionRequest = registrationSettings.EnableInstructorPermissionRequest,
                        RegisterForPendingCourses = registrationSettings.EnableRegisterForPendingCourses,
                        PersonId = Account.PersonId,
                        Registered = true,
                        Term = yearTerm.Term,
                        Waitlist = true,
                        Year = yearTerm.Year
                    };
                    (classDetails, blockClassDetails) = _scheduleService.GetForStudent(filter);
                    List<List<StudentScheduleViewModel>> studentSchedule = classDetails.ToStudentViewModel(_institutionSettingService, CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial);
                    List<BlockStudentScheduleViewModel> blockStudentSchedule = new();
                    if (blockClassDetails?.Count > 0)
                    {
                        foreach (BlockClassDetail row in blockClassDetails)
                        {
                            blockStudentSchedule.Add(new()
                            {
                                AllowChanges = row.AllowChanges,
                                BlockRegistrationRuleGroupId = row.BlockRegistrationRuleGroupId,
                                BlockRegRuleGroupBlockId = row.BlockRegRuleGroupBlockId,
                                DisplayName = row.DisplayName,
                                NumberOfSections = row.NumberOfSections,
                                Order = row.Order,
                                ShowDrop = registrationSettings.AllowDrops,
                                StudentSchedule = row.ClassDetails.ToStudentViewModel(_institutionSettingService, CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial)
                            });
                        }
                    }
                    return Json(SerializationHelper.ToJsonResult(new { studentSchedule, blockStudentSchedule }));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the student report.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException">model</exception>
        [HttpGet]
        [Route("Schedule/StudentReport/{Filter}/{YearTermSession.Year}/{YearTermSession.Term}/{YearTermSession.Session?}/{ImpersonateInfo.Process?}/{ImpersonateInfo.PersonId?}/{ImpersonateInfo.ViewId?}/{ImpersonateInfo.TabId?}")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public ActionResult StudentReport(StudentReportFilterModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;

                PeopleYearTermSessionModel peopleYearTermSession = new()
                {
                    PersonId = personId,
                    Session = string.IsNullOrEmpty(model.YearTermSession.Session) || model.YearTermSession.Session.Equals("-")
                                ? null : model.YearTermSession.Session,
                    Term = model.YearTermSession.Term,
                    Year = model.YearTermSession.Year
                };
                string language = _settingHelper.GetLanguage(Account);
                byte[] report = _reportHelper.GetStudentSchedule(peopleYearTermSession, CurrentNameFormat, CurrentNameSort, model.Filter,
                    ShowMiddleNameInitial, language);
                return File(report, "application/pdf", "StudentScheduleReport.pdf");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

        /// <summary>
        /// Gets the con ed courses.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        private List<List<ClassDetail>> GetConEdCourses(int personId)
        {
            try
            {
                InstitutionSettings.ConEdRegistration conEdRegistrationSettings = _institutionSettingService.GetConEdRegistration();
                bool allowChangeOfCreditType = conEdRegistrationSettings.AllowChangeOfCreditType;
                ClassDetailFilter filter = new()
                {
                    Cart = true,
                    CreditTypes = allowChangeOfCreditType,
                    PermissionRequest = conEdRegistrationSettings.EnableInstructorPermissionRequest,
                    RegisterForPendingCourses = conEdRegistrationSettings.EnableRegisterForPendingCourses,
                    PersonId = personId,
                    Registered = true,
                    Waitlist = true,
                };
                return _scheduleService.GetForStudentConEd(filter);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                throw;
            }
        }

        #region Schedule Approval Requests

        /// <summary>
        /// Retrieves the Approval requests.
        /// </summary>
        /// <param name="approvalRequestsListModel">The approval requests list model.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ImpersonateAttribute))]
        [Route("Schedule/ApprovalRequests")]
        public JsonResult ApprovalRequests([FromBody] ApprovalRequestsListModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));
                int personId = model.ImpersonateInfo.PersonId;
                int sessionPeriodId = model.SessionPeriodId;

                string dateTimeCultureFormat = _institutionSettingService.GetGeneral().DateTimeCulture;
                List<ScheduleRequest> advisorApprovalRequestList = _scheduleRequestService.GetSections(personId, sessionPeriodId);
                return Json(SerializationHelper.ToJsonResult(advisorApprovalRequestList.ToViewModel(dateTimeCultureFormat)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified schedule Request for the person identifier.
        /// </summary>
        /// <param name="model">The approval requests save model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Schedule/ApprovalRequests/Save")]
        public JsonResult SaveApprovalRequest([FromBody] ApprovalRequestsSaveModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                int personId = model.ImpersonateInfo.PersonId;
                int sessionPeriodId = model.SessionPeriodId;
                List<ApprovalRequestModel> approvalRequests = model.ApprovalRequests;

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                string language = _settingHelper.GetLanguage(Account);
                ValidationMessagesResources registrationResources = _resourcesHelper.GetResourceType<ValidationMessagesResources>(language, new("Registration", "ValidationMessagesSchedule"));
                RegistrationMessage registrationMessage = new();
                if (approvalRequests?.Count > 0)
                {
                    registrationMessage = _registrationService.SaveScheduleRequests(personId, Account.PersonId, sessionPeriodId,
                        approvalRequests.ToDto(), _institutionSettingService.GetRegistration(), _scheduleService);
                }
                return Json(SerializationHelper.ToJsonResult(registrationMessage.ToViewModel(registrationResources, false, general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Validates the specified schedule request for the person identifier.
        /// </summary>
        /// <param name="model">The approval request validation model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Schedule/ApprovalRequests/Validate")]
        public JsonResult ValidateApprovalRequest([FromBody] ApprovalRequestValidationModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                int personId = model.ImpersonateInfo.PersonId;
                int sessionPeriodId = model.SessionPeriodId;
                List<int> approvalRequests = model.ApprovalRequests;

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                string language = _settingHelper.GetLanguage(Account);
                ValidationMessagesResources registrationResources = _resourcesHelper.GetResourceType<ValidationMessagesResources>(language, new("Registration", "ValidationMessagesSchedule"));
                RegistrationMessage registrationMessage =
                    _registrationService.ValidateProposedSchedule(personId, sessionPeriodId, _institutionSettingService.GetRegistration(), approvalRequests);
                return Json(SerializationHelper.ToJsonResult(registrationMessage.ToViewModel(registrationResources, false, general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ScheduleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Schedule Approval Requests
    }
}