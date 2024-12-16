// --------------------------------------------------------------------
// <copyright file="SectionsController.cs" company="Ellucian">
//     Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Core.Logic;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.CourseTemplates;
using SelfService.Models.Registration;
using SelfService.Models.Resources;
using SelfService.Models.Section;
using SelfService.Models.Shared;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Sections route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(NoDirectAccessAttribute))]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class SectionsController : BaseEndpointController
    {
        /// <summary>
        /// The assignment service
        /// </summary>
        private readonly IAssignmentService _assignmentService;

        /// <summary>
        /// The assignment template service
        /// </summary>
        private readonly IAssignmentTemplateService _assignmentTemplateService;

        /// <summary>
        /// The attendance service
        /// </summary>
        private readonly IAttendanceService _attendanceService;

        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The department head service
        /// </summary>
        private readonly IDepartmentHeadService _departmentHeadService;

        /// <summary>
        /// The department service
        /// </summary>
        private readonly IDepartmentService _departmentService;

        /// <summary>
        /// The faculty assistant service
        /// </summary>
        private readonly IFacultyAssistantService _facultyAssistantService;

        /// <summary>
        /// The grade activity service
        /// </summary>
        private readonly IGradeActivityService _gradeActivityService;

        /// <summary>
        /// The grade service
        /// </summary>
        private readonly IGradeService _gradeService;

        /// <summary>
        /// The institution grade mapping service
        /// </summary>
        private readonly IInstitutionGradeMappingService _institutionGradeMappingService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<SectionsController> _logger;

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
        /// The report helper
        /// </summary>
        private readonly IReportHelper _reportHelper;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The section grade mapping services
        /// </summary>
        private readonly ISectionGradeMappingService _sectionGradeMappingService;

        /// <summary>
        /// The section service
        /// </summary>
        private readonly ISectionService _sectionService;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// The setting service
        /// </summary>
        private readonly ISettingService _settingService;

        /// <summary>
        /// The violation service
        /// </summary>
        private readonly IViolationService _violationService;

        /// <summary>
        /// Initializes a new instance of the <see cref="SectionsController"/> class.
        /// </summary>
        /// <param name="assignmentService">The assignment service.</param>
        /// <param name="assignmentTemplateService">The assignment template service.</param>
        /// <param name="attendanceService">The attendance service.</param>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="departmentHeadService">The department head service.</param>
        /// <param name="departmentService">The department service.</param>
        /// <param name="facultyAssistantService">The faculty assistant service.</param>
        /// <param name="gradeActivityService">The grade activity service.</param>
        /// <param name="gradeService">The grade service.</param>
        /// <param name="institutionGradeMappingService">The institution grade mapping service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="periodService">The period service.</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="reportHelper">The report helper.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="sectionGradeMappingService">The section grade mapping service.</param>
        /// <param name="sectionService">The section service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="settingService">The setting service.</param>
        /// <param name="violationService">The violation service.</param>
        /// <param name="logger">The logger.</param>
        public SectionsController(
            IAssignmentService assignmentService,
            IAssignmentTemplateService assignmentTemplateService,
            IAttendanceService attendanceService,
            ICodeTableService codeTableService,
            IDepartmentHeadService departmentHeadService,
            IDepartmentService departmentService,
            IFacultyAssistantService facultyAssistantService,
            IGradeActivityService gradeActivityService,
            IGradeService gradeService,
            IInstitutionGradeMappingService institutionGradeMappingService,
            IInstitutionSettingService institutionSettingService,
            IPeopleService peopleService,
            IPeriodService periodService,
            IPictureHelper pictureHelper,
            IReportHelper reportHelper,
            IResourcesHelper resourcesHelper,
            ISectionGradeMappingService sectionGradeMappingService,
            ISectionService sectionService,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            ISettingService settingService,
            IViolationService violationService,
            IAppLogger<SectionsController> logger)
            : base(serializationHelper)
        {
            _assignmentService = assignmentService;
            _assignmentTemplateService = assignmentTemplateService;
            _attendanceService = attendanceService;
            _codeTableService = codeTableService;
            _departmentHeadService = departmentHeadService;
            _departmentService = departmentService;
            _facultyAssistantService = facultyAssistantService;
            _gradeActivityService = gradeActivityService;
            _gradeService = gradeService;
            _institutionGradeMappingService = institutionGradeMappingService;
            _institutionSettingService = institutionSettingService;
            _peopleService = peopleService;
            _periodService = periodService;
            _pictureHelper = pictureHelper;
            _reportHelper = reportHelper;
            _resourcesHelper = resourcesHelper;
            _sectionGradeMappingService = sectionGradeMappingService;
            _settingHelper = settingHelper;
            _sectionService = sectionService;
            _settingService = settingService;
            _violationService = violationService;

            _logger = logger;
        }

        #region General

        /// <summary>
        /// Gets Advanced Search.
        /// </summary>
        /// <param name="sectionSearchParameters">The section search parameters.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/AdvancedSearch")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult AdvancedSearch([FromBody] SectionSearch sectionSearchParameters)
        {
            try
            {
                sectionSearchParameters.PersonId = null;
                sectionSearchParameters.RegistrationType = "TRAD";
                SectionsListViewModel sectionsList = SearchSections(sectionSearchParameters, false, null, null, true);
                return Json(SerializationHelper.ToJsonResult(sectionsList.Sections));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Endpoint to get the options for the advanced search.
        /// </summary>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Sections/AdvancedSearchOptions")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult AdvancedSearchOptions()
        {
            try
            {
                SectionSearchOption options = _sectionService.GetSearchOptions();
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(
                    options.ToViewModel(CurrentNameFormat, CurrentNameSort, false, ShowMiddleNameInitial, general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Blocks the registration search.
        /// </summary>
        /// <param name="searchModel">The search model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/BlockRegistrationSearch")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult BlockRegistrationSearch([FromBody] SearchModel searchModel)
        {
            try
            {
                SectionSearch sectionSearchParameters = searchModel.SectionSearchParameters;
                int startIndex = searchModel.StartIndex ?? 0;
                int length = searchModel.Length ?? 5;
                sectionSearchParameters.PersonId = null;
                sectionSearchParameters.RegistrationType = "TRAD";
                TermPeriod period = _periodService.GetYearTerm(sectionSearchParameters.PeriodId);
                sectionSearchParameters.Period = $"{period.Year}/{period.TermCode}";
                SectionsListViewModel sectionsList = SearchSections(sectionSearchParameters, false, startIndex, length, true);
                return Json(SerializationHelper.ToJsonResult(sectionsList));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Blocks the registration search options.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/BlockRegistrationSearchOptions")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult BlockRegistrationSearchOptions()
        {
            try
            {
                SectionSearchOption options = _sectionService.GetSearchOptions();
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(
                    options.ToViewModel(CurrentNameFormat, CurrentNameSort, true, ShowMiddleNameInitial, general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Search sections by Event Id, grouped by period.
        /// </summary>
        /// <param name="sectionModel">The section model.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Sections/ByPeriod")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult ByPeriod([FromBody] SectionModel sectionModel)
        {
            try
            {
                string eventId = sectionModel.EventId;
                string eventSubType = sectionModel.EventSubType;
                int? personId = sectionModel.PersonId;
                if (!string.IsNullOrEmpty(eventSubType))
                {
                    CodeTable catalog = _codeTableService.GetByName(CodeTableName.EventSubType, true).Find(x => x.Description == eventSubType);
                    eventSubType = catalog.CodeValueKey;
                }
                string wildcard = _settingService.GetWildcard();
                SectionSearch sectionSearch = new()
                {
                    EventId = eventId.Replace(wildcard[0], '*'),
                    PersonId = personId,
                    EventSubType = eventSubType,
                    RegistrationType = "TRAD"
                };
                SectionsListViewModel sectionsList = SearchSections(sectionSearch, false, null, null, true);
                List<SectionByPeriodViewModel> sectionsByPeriod = ToSectionByPeriodList(sectionsList.Sections);
                return Json(SerializationHelper.ToJsonResult(sectionsByPeriod));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Cons the ed.
        /// </summary>
        /// <param name="keyWords">The key words.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Sections/ConEd")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult ConEd([FromBody] string keyWords)
        {
            try
            {
                SectionsListViewModel sectionsList = new();
                if (!string.IsNullOrEmpty(keyWords))
                {
                    SectionSearch sectionSearch = new()
                    {
                        Keywords = keyWords,
                        PersonId = null,
                        RegistrationType = "CONED"
                    };
                    sectionsList = SearchSections(sectionSearch, true, null, null, true);
                }
                bool showPicture = _institutionSettingService.GetConEdRegistration().ShowCoursePicture;
                return Json(SerializationHelper.ToJsonResult(new { sectionsList.Sections, showPicture }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Cons the ed advanced search.
        /// </summary>
        /// <param name="sectionSearchParameters">The section search parameters.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Sections/ConEdAdvancedSearch")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult ConEdAdvancedSearch([FromBody] SectionSearch sectionSearchParameters)
        {
            try
            {
                sectionSearchParameters.PersonId = null;
                sectionSearchParameters.RegistrationType = "CONED";
                SectionsListViewModel sectionsList = SearchSections(sectionSearchParameters, false, null, null, true);
                bool showPicture = _institutionSettingService.GetConEdRegistration().ShowCoursePicture;
                return Json(SerializationHelper.ToJsonResult(new { sectionsList.Sections, showPicture }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Cons the ed.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/ConEdStatus")]
        public JsonResult ConEdStatus()
        {
            try
            {
                // Stoplist
                bool isOnStopList = false;
                List<StopList> stopLists = _peopleService.GetStopList(Account.PersonId);
                if (stopLists?.Count > 0)
                    isOnStopList = stopLists.Find(x => x.IsRegistrationStop) != null;
                // Agreement
                AgreementDetail agreement = null;
                const bool agreementStatus = true;
                return Json(SerializationHelper.ToJsonResult(new
                {
                    agreement,
                    agreementStatus,
                    isOnStopList
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Copies the activities.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="SessionPeriodId">The session period identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/CopyActivities/Courses")]
        public JsonResult CopyActivities([FromBody] CopyActivitiesModel copyActivitiesModel)
        {
            try
            {
                int sessionPeriodId = copyActivitiesModel.SessionPeriodId;
                int sectionId = copyActivitiesModel.SectionId;

                List<SectionPeriod> sectionsDTO = new();
                if (CurrentLinkId == "CourseManagementId")
                    sectionsDTO = _departmentHeadService.GetCourses(Account.PersonId, sessionPeriodId, 2);
                else if (CurrentLinkId == "FacultyCourseManagementId")
                    sectionsDTO = _departmentHeadService.GetFacultyCourses(Account.PersonId, sessionPeriodId, 2);
                sectionsDTO = sectionsDTO.Where(x => x.Id != sectionId).ToList();
                List<ListOptionViewModel> sections = sectionsDTO.ToViewModel();
                return Json(SerializationHelper.ToJsonResult(sections));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Courses the management.
        /// </summary>
        /// <param name="sessionPeriodId">The session period identifier.</param>
        /// <param name="filter">The filter.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/CourseManagement")]
        public JsonResult CourseManagement([FromBody] SectionCourseManagementViewModel filter)
        {
            try
            {
                if (filter.SessionPeriodId != null && filter.SessionPeriodId <= 0)
                {
                    _logger.LogError(Constants._product, typeof(SectionsController).FullName, "Id is zero");
                    return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
                }
                List<SectionPeriod> sectionsDTO = null;
                bool defaultList = true;
                if (filter.DepartmentId != null && filter.DepartmentId > 0)
                {
                    sectionsDTO = _departmentHeadService.GetCoursesByDepartment(filter.DepartmentId.Value, filter.SessionPeriodId.Value);
                    defaultList = false;
                }
                else if (filter.FacultyId != null && filter.FacultyId > 0)
                {
                    sectionsDTO = _departmentHeadService.GetCoursesByFaculty(Account.PersonId, filter.FacultyId.Value, filter.SessionPeriodId.Value);
                    defaultList = false;
                }
                else if (!string.IsNullOrEmpty(filter.Year))
                {
                    sectionsDTO = _departmentHeadService.GetCoursesByYear(Account.PersonId, filter.SessionPeriodId.Value);
                    defaultList = false;
                }
                if (defaultList)
                    sectionsDTO = _departmentHeadService.GetFacultyCourses(Account.PersonId, filter.SessionPeriodId.Value, 0);
                List<ListOptionViewModel> sections = sectionsDTO.ToViewModel();
                ListOptionViewModel defaultSection = null;
                if (filter.SectionId != null && filter.SectionId > 0 && sectionsDTO?.Count > 0 && sections?.Count > 0)
                {
                    int position = -1;
                    position = sectionsDTO.FindIndex(s => s.Id == filter.SectionId.Value);
                    if (position >= 0)
                        defaultSection = sections[position];
                }
                return Json(SerializationHelper.ToJsonResult(new { sections, defaultSection }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the section details.
        /// </summary>
        /// <param name="model">The section detail model.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/Details")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Details([FromBody] SectionDetailModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                string language = _settingHelper.GetLanguage(Account);
                InstitutionSettings.CourseMaterials courseMaterials = _institutionSettingService.GetCourseMaterials();
                string courseMaterialsTextToDisplay = courseMaterials.TextToDisplay;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Registration registration = _institutionSettingService.GetRegistration();
                SectionDetail sectionDetail;
                bool enableWaitList = false;
                if (model.WithIsCartable)
                {
                    int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                    int temporaryUserId = Account?.TemporaryUserId > 0 ? Account.TemporaryUserId : 0;
                    InstitutionSettings.ConEdRegistration conEdRegistration = _institutionSettingService.GetConEdRegistration();
                    sectionDetail = _sectionService.GetDetail(model.Id, true, personId, temporaryUserId, conEdRegistration);
                    if (sectionDetail != null)
                    {
                        if (sectionDetail.IsConEd)
                            enableWaitList = conEdRegistration.EnableWaitList;
                        else
                            enableWaitList = _institutionSettingService.GetRegistration().EnableWaitList;
                    }
                }
                else
                {
                    sectionDetail = _sectionService.GetDetail(model.Id);
                }
                string courseMaterialsUrl = _sectionService.GetCourseMaterials(sectionDetail.SectionId, model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId);

                List<SessionPeriodFilterInfo> periodFiltersList = _periodService.GetFilters(21,sectionDetail.AcademicYear);
                if(periodFiltersList != null)
                {
                    bool isPeriodFilterEnabled = periodFiltersList.Exists(
                    periodFilter => periodFilter.Term == sectionDetail.AcademicTermDesc &&
                    periodFilter.Session == sectionDetail.AcademicSessionDesc &&
                    periodFilter.IsIncluded
                    );
                    if (!isPeriodFilterEnabled)
                    {
                        courseMaterialsTextToDisplay = string.Empty;
                        courseMaterialsUrl = string.Empty;
                    }
                }

                CultureInfo cultureInfo = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
                DegReqsResources degReqsResources = _resourcesHelper.GetServerResourceType<DegReqsResources>(language, "DegReqs", ValidationHelper.IsValidResource);
                return Json(SerializationHelper.ToJsonResult(sectionDetail.ToViewModel(degReqsResources, CurrentNameFormat, CurrentNameSort, enableWaitList,
                    general, cultureInfo, formatProvider, formatCurrency, ShowMiddleNameInitial, registration, courseMaterialsTextToDisplay, courseMaterialsUrl)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get section details.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Sections/AnonymousDetails")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Details([FromBody] int id)
        {
            try
            {
                string language = _settingHelper.GetLanguage(Account);
                InstitutionSettings.CourseMaterials courseMaterials = _institutionSettingService.GetCourseMaterials();
                string courseMaterialsTextToDisplay = courseMaterials.TextToDisplay;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Registration registration = _institutionSettingService.GetRegistration();
                SectionDetail sectionDetail = _sectionService.GetDetail(id);
                string courseMaterialsUrl = _sectionService.GetCourseMaterials(sectionDetail.SectionId);

                List<SessionPeriodFilterInfo> periodFiltersList = _periodService.GetFilters(21, sectionDetail.AcademicYear);
                if (periodFiltersList != null)
                {
                    bool isPeriodFilterEnabled = periodFiltersList.Exists(
                    periodFilter => periodFilter.Term == sectionDetail.AcademicTermDesc &&
                    periodFilter.Session == sectionDetail.AcademicSessionDesc &&
                    periodFilter.IsIncluded
                    );
                    if (!isPeriodFilterEnabled)
                    {
                        courseMaterialsTextToDisplay = string.Empty;
                        courseMaterialsUrl = string.Empty;
                    }
                }

                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
                DegReqsResources degReqsResources = _resourcesHelper.GetServerResourceType<DegReqsResources>(language, "DegReqs", ValidationHelper.IsValidResource);

                return Json(SerializationHelper.ToJsonResult(sectionDetail.ToViewModel(degReqsResources, CurrentNameFormat, CurrentNameSort, false,
                    general, datetimeCulture, formatProvider, formatCurrency, ShowMiddleNameInitial, registration, courseMaterialsTextToDisplay, courseMaterialsUrl)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Indexes the specified section keyword model.
        /// </summary>
        /// <param name="sectionKeywordModel">The section keyword model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Index([FromBody] SectionKeywordModel sectionKeywordModel)
        {
            try
            {
                string keywords = sectionKeywordModel.Keywords;
                string yearTerm = sectionKeywordModel.YearTerm;
                SectionsListViewModel sectionsList = new();
                if (!string.IsNullOrEmpty(keywords) && !string.IsNullOrEmpty(yearTerm))
                {
                    SectionSearch sectionSearch = new()
                    {
                        Keywords = keywords,
                        Period = yearTerm,
                        PersonId = null,
                        RegistrationType = "TRAD"
                    };
                    sectionsList = SearchSections(sectionSearch, true, null, null, true);
                }
                return Json(SerializationHelper.ToJsonResult(sectionsList.Sections));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the personIds for the instructors of a section.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/Instructors")]
        public JsonResult Instructors([FromBody] int sectionId)
        {
            try
            {
                List<int> instructors = _sectionService.GetFacultyIds(sectionId);
                return Json(SerializationHelper.ToJsonResult(instructors));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Searches the specified section search parameters.
        /// </summary>
        /// <param name="sectionSearchParameters">The section search parameters.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Sections/Search")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Search([FromBody] SearchModel searchModel)
        {
            try
            {
                int length = searchModel.Length.Value;
                SectionSearch sectionSearchParameters = searchModel.SectionSearchParameters;
                int startIndex = searchModel.StartIndex.Value;

                sectionSearchParameters.PersonId = null;
                sectionSearchParameters.RegistrationType = "TRAD";
                SectionsListViewModel sectionsList = SearchSections(sectionSearchParameters, false, startIndex, length, false);
                return Json(SerializationHelper.ToJsonResult(sectionsList));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Times the conflict.
        /// </summary>
        /// <param name="sectionIds">The section ids.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/TimeConflict")]
        public JsonResult TimeConflict([FromBody] List<int> sectionIds)
        {
            try
            {
                List<ScheduleTimeViewModel> sectionSchedules = new();
                if (sectionIds?.Count > 0)
                    sectionSchedules = _sectionService.ValidateTimeConflicts(sectionIds).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(sectionSchedules));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion General

        #region Department SetupApprovals

        /// <summary>
        /// Requires the approval.
        /// </summary>
        /// <param name="approvalRequirementModel">The approval requirement model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/RequireApproval")]
        public JsonResult RequireApproval([FromBody] ApprovalRequirementModel approvalRequirementModel)
        {
            try
            {
                int departmentPosition = approvalRequirementModel.DepartmentPosition;
                int sectionPosition = approvalRequirementModel.SectionPosition;
                int sectionId = approvalRequirementModel.SectionId;
                bool requireApproval = approvalRequirementModel.RequireApproval;

                bool result = _departmentService.UpdateRequiresGradeApproval(sectionId, requireApproval);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    status = result,
                    departmentPosition,
                    sectionPosition
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Setups the approvals.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/SetupApprovals")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult SetupApprovals([FromBody] SectionCourseManagementViewModel filter)
        {
            try
            {
                if (filter.SessionPeriodId != null && filter.SessionPeriodId <= 0)
                {
                    _logger.LogError(Constants._product, typeof(SectionsController).FullName, "Id is zero");
                    return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
                }
                List<SectionPeriodDetail> sectionsDTO = null;
                if (filter.DepartmentId != null && filter.DepartmentId > 0)
                    sectionsDTO = _departmentHeadService.GetSectionsByDepartment(filter.DepartmentId.Value, filter.SessionPeriodId.Value);
                else if (filter.FacultyId != null && filter.FacultyId > 0)
                    sectionsDTO = _departmentHeadService.GetSectionsByFaculty(Account.PersonId, filter.FacultyId.Value, filter.SessionPeriodId.Value);
                else if (!string.IsNullOrEmpty(filter.Year))
                    sectionsDTO = _departmentHeadService.GetSectionsByYear(Account.PersonId, filter.SessionPeriodId.Value);

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<SectionDepartmentHeadViewModel> sections = sectionsDTO.ToViewModel(CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial, general);
                return Json(SerializationHelper.ToJsonResult(sections));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Department SetupApprovals

        #region ApproveGrades

        /// <summary>
        /// Approves the grades.
        /// </summary>
        /// <param name="sessionPeriodId">The session period identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/ApproveGrades")]
        public JsonResult ApproveGrades([FromBody] int sessionPeriodId)
        {
            try
            {
                List<SectionPeriod> sectionPeriods = _departmentHeadService.GetStudentGradeSections(Account.PersonId, sessionPeriodId);
                List<ListOptionViewModel> sections = sectionPeriods.ToViewModel();
                return Json(SerializationHelper.ToJsonResult(sections));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Approves grades get section information.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/ApproveGrades/Section")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult ApproveGradesSection([FromBody] int sectionId)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Registration registration = _institutionSettingService.GetRegistration();
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                SectionDetail sectionDetail = _sectionService.GetDetail(sectionId);
                SectionViewModel section = sectionDetail.ToViewModel(true, CurrentNameFormat, CurrentNameSort,
                    false, general, datetimeCulture, formatProvider, ShowMiddleNameInitial, registration);

                return Json(SerializationHelper.ToJsonResult(section));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Approves the grades students.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/ApproveGrades/Students")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult ApproveGradesStudents([FromBody] int sectionId)
        {
            try
            {
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                SectionStudentGrade sectionStudentGrade = _sectionService.GetStudentGradesBySection(sectionId, false, Account.PersonId);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                SectionGradeValidationResult validationResult = _gradeService.ValidateAssignmentGrading(sectionId);
                SectionOverallGradeListViewModel sectionOverallGradeList = sectionStudentGrade.ToViewModel(sectionId, Account.PersonId,
                    false, true, CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial, _settingService, _sectionService,
                    _departmentHeadService, _facultyAssistantService);
                if (validationResult.CourseSetupStatus == CourseSetupStatus.Invalid)
                {
                    sectionOverallGradeList.Errors = new List<string>();
                    sectionOverallGradeList.SectionSetupStatus = 1;
                }
                if (validationResult.CourseSetupStatus == CourseSetupStatus.NoAssignmentsExist)
                {
                    sectionOverallGradeList.ShowFinaltermCalculatedScore = false;
                    sectionOverallGradeList.ShowMidtermCalculatedScore = false;
                }
                sectionOverallGradeList.EmailSettings = new()
                {
                    Email = mail.Email,
                    CanEditRecipient = mail.CanEditRecipient,
                    CanEditSender = mail.CanEditSender,
                    EmailProvider = mail.EmailProvider,
                    Sender = mail.Sender,
                    StaffSeparator = mail.StaffSeparator,
                    StaffUrl = mail.StaffUrl,
                    StudentSeparator = mail.StudentSeparator,
                    StudentUrl = mail.StudentUrl
                };
                sectionOverallGradeList.ShowFinaltermApply = false;
                sectionOverallGradeList.ShowMidtermApply = false;
                return Json(SerializationHelper.ToJsonResult(sectionOverallGradeList));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Students the grades by section.
        /// </summary>
        /// <param name="studentGradesBySectionModel">The student grades by section model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/StudentGrades/Save")]
        public JsonResult StudentGradesBySection([FromBody] StudentGradesBySectionModel studentGradesBySectionModel)
        {
            try
            {
                int sectionId = studentGradesBySectionModel.SectionId;
                List<GradeApproval> sectionApproveGrades = studentGradesBySectionModel.SectionApproveGrades.ConvertAll(sag =>
                {
                    return new GradeApproval(sag.GradeApprovalId, sectionId, sag.StudentId, sag.IsMidterm ? GradeType.MidtermGrade : GradeType.FinalGrade)
                    {
                        Comment = sag.Comments,
                        Grade = sag.Grade,
                        ApproverId = Account.PersonId,
                    };
                });

                bool result = _gradeService.UpdateApproval(sectionApproveGrades, Account.PersonId, sectionId,
                    _institutionSettingService.GetCourseManagement().MidtermGrades);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion ApproveGrades

        #region Classes Enrollment

        /// <summary>
        /// Edits the permission requests.
        /// </summary>
        /// <param name="permissionRequestList">The permission request list.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/EditPermissionRequests")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementPermissionRequests
         }, true })]
        public JsonResult EditPermissionRequests([FromBody] List<PermissionRequestModel> permissionRequestList)
        {
            try
            {
                bool result = false;
                if (permissionRequestList?.Count > 0)
                {
                    foreach (PermissionRequestModel permissionRequest in permissionRequestList)
                    {
                        if (permissionRequest?.Id > 0
                            && (!string.IsNullOrEmpty(permissionRequest.Comments) || permissionRequest.Status >= 0))
                        {
                            _sectionService.UpdatePermissionRequestStatus(
                                permissionRequest.Id,
                                (InstructorPermissionStatus)permissionRequest.Status,
                                permissionRequest.Comments);
                        }
                    }
                    result = true;
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, -1, false));
            }
        }

        /// <summary>
        /// Updates the waitlist.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="personIds">The person ids.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/EditStatusWaitlist")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementWaitList,
            ClaimsConstants.DepartmentCourseManagementWaitList
         }, true })]
        public JsonResult EditStatusWaitlist([FromBody] WaitlistStatusEditModel editStatusWaitlistModel)
        {
            try
            {
                int sectionId = editStatusWaitlistModel.SectionId;
                List<int> personIds = editStatusWaitlistModel.PersonIds;

                int updateResult = _sectionService.ChangeWaitListToPending(sectionId, personIds);
                bool result = updateResult > 0;
                return Json(SerializationHelper.ToJsonResult(new { result, updateResult }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the Enrollments for the specified section identifier.
        /// </summary>
        /// <param name="enrollmentModel">The enrollment model.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("Sections/Enrollment")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementClassList,
            ClaimsConstants.DepartmentCourseManagementClassList
         }, true })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Enrollment([FromBody] EnrollmentModel enrollmentModel)
        {
            try
            {
                int sectionId = enrollmentModel.SectionId;
                int status = enrollmentModel.Status;

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                SectionEnrollment sectionEnrollment = _sectionService.GetEnrollment(sectionId, status);
                return Json(SerializationHelper.ToJsonResult(sectionEnrollment.ToClassListViewModel(CurrentNameFormat, CurrentNameSort, general, mail, ShowMiddleNameInitial, _peopleService, _pictureHelper)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Enrollments the report.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="status">The status.</param>
        /// <returns>File</returns>
        [HttpGet]
        [Route("Sections/EnrollmentReport/{sectionId}/{status}")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public ActionResult EnrollmentReport(int sectionId, int status)
        {
            try
            {
                string language = _settingHelper.GetLanguage(Account);
                byte[] report = _reportHelper.GetClassList(sectionId, status, CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial, language);
                return File(report, "application/pdf", "ClassListReport.pdf");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

        /// <summary>
        /// Permissions the requests.
        /// </summary>
        /// <param name="sectionId">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/PermissionRequests")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementPermissionRequests
         }, true })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult PermissionRequests([FromBody] int sectionId)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                List<StudentPermissionRequest> sectionPermissionRequestList = _sectionService.GetPermissionRequests(sectionId, Account.PersonId);
                for (int i = 0; i < sectionPermissionRequestList.Count; i++)
                    sectionPermissionRequestList[i].HasPicture = _pictureHelper.GetPictureAsync(_peopleService.GetPicture(sectionPermissionRequestList[i].PersonId.Value)) != null;
                return Json(SerializationHelper.ToJsonResult(
                    sectionPermissionRequestList.ToViewModel(Account.PersonId.ToString(), GetSectionPrerequisites(sectionId, CurrentNameFormat, ShowMiddleNameInitial),
                    CurrentNameFormat, CurrentNameSort, general, mail, ShowMiddleNameInitial, general.DateTimeCulture)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the waitlist of the section.
        /// </summary>
        /// <param name="sectionId">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/Waitlist")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementWaitList,
            ClaimsConstants.DepartmentCourseManagementWaitList
         }, true })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Waitlist([FromBody] int sectionId)
        {
            try
            {
                SectionWaitlist waitlist = _sectionService.GetWaitlist(sectionId);
                for (int i = 0; i < waitlist.Students.Count; i++)
                    waitlist.Students[i].HasPicture = _pictureHelper.GetPictureAsync(_peopleService.GetPicture(waitlist.Students[i].PersonId.Value)) != null;
                return Json(SerializationHelper.ToJsonResult(waitlist.ToWaitlistViewModel(
                    sectionId, _institutionSettingService, CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial, _sectionService)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Classes Enrollment

        #region Classes Setup

        /// <summary>
        /// Get Activities for the specified section.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [Route("Sections/{sectionId}/Activities")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementActivities,
            ClaimsConstants.DepartmentCourseManagementActivities
         }, true })]
        public JsonResult Activities(int sectionId)
        {
            try
            {
                SectionAssignmentSetup sectionAssignmentSetupDTO = _assignmentService.GetSetup(sectionId);
                SectionAssignmentValidationResult sectionAssignmentValidationResult = _assignmentService.Validate(sectionId);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                SectionAssignmentSetupViewModel sectionAssignmentSetup = sectionAssignmentSetupDTO.ToViewModel(_settingService, general);
                bool isRestricted = _departmentService.IsRestrictedCourse(sectionId);
                return Json(SerializationHelper.ToJsonResult(new { sectionAssignmentValidationResult, sectionAssignmentSetup, isRestricted }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, exception.Message, 0, false));
            }
        }

        /// <summary>
        /// Assignmentses the specified section identifier.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/Assignments")]
        public JsonResult Assignments([FromBody] int sectionId)
        {
            try
            {
                string numberCultureFormat = _institutionSettingService.GetGeneral().NumberCulture;
                List<AssignmentViewModel> assignments = _assignmentService.Get(sectionId).ToViewModel(true, numberCultureFormat);
                return Json(SerializationHelper.ToJsonResult(assignments));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Copies the activities.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/CopyActivities/Periods")]
        public JsonResult CopyActivities([FromBody] int sectionId)
        {
            try
            {
                List<ListOptionViewModel> periods = new();
                ListOptionViewModel defaultPeriod = new();
                List<ListOptionViewModel> sections = new();
                SessionPeriod defaultSessionPeriod = null;
                List<SectionPeriod> sectionPeriods = new();
                List<SessionPeriod> sessionPeriods = new();
                if (CurrentLinkId == "CourseManagementId")
                {
                    sessionPeriods = _departmentHeadService.GetPeriods(Account.PersonId);
                    if (sessionPeriods?.Count > 0)
                    {
                        defaultSessionPeriod = _periodService.GetDefault(sessionPeriods);
                        sectionPeriods = _departmentHeadService.GetCourses(Account.PersonId, (int)defaultSessionPeriod.SessionPeriodId, 2);
                    }
                }
                else if (CurrentLinkId == "FacultyCourseManagementId")
                {
                    sessionPeriods = _departmentHeadService.GetFacultyPeriods(Account.PersonId);
                    if (sessionPeriods?.Count > 0)
                    {
                        defaultSessionPeriod = _periodService.GetDefault(sessionPeriods);
                        sectionPeriods = _departmentHeadService.GetFacultyCourses(Account.PersonId, (int)defaultSessionPeriod.SessionPeriodId, 2);
                    }
                }
                if (sessionPeriods?.Count > 0)
                {
                    periods = sessionPeriods.ToViewModel(true);
                    defaultPeriod = defaultSessionPeriod.ToViewModel(true);
                }
                if (sectionPeriods.Count > 0)
                {
                    sectionPeriods = sectionPeriods.Where(x => x.Id != sectionId).ToList();
                    if (sectionPeriods.Count > 0)
                        sections = sectionPeriods.ToViewModel();
                }

                return Json(SerializationHelper.ToJsonResult(new
                {
                    periods,
                    defaultPeriod,
                    sections
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the activities for the specified Section
        /// </summary>
        /// <param name="sectionId">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/Activities/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementActivities,
            ClaimsConstants.DepartmentCourseManagementActivities
         }, true })]
        public JsonResult DeleteActivities([FromBody] int sectionId)
        {
            try
            {
                bool result = _assignmentService.Delete(sectionId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the activity.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/Activity/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementActivities,
            ClaimsConstants.DepartmentCourseManagementActivities
         }, true })]
        public JsonResult DeleteActivity([FromBody] int id)
        {
            try
            {
                bool result = _assignmentService.Delete(id, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the grade mappings.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/GradeMappings/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementGradeMappings,
            ClaimsConstants.DepartmentCourseManagementGradeMappings
         }, true })]
        public JsonResult DeleteGradeMappings([FromBody] int sectionId)
        {
            try
            {
                bool result = false;
                if (sectionId > 0)
                    result = _sectionGradeMappingService.Delete(sectionId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the creditType for grade mappings.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [Route("Sections/GradeMappings/{id}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementGradeMappings,
            ClaimsConstants.DepartmentCourseManagementGradeMappings
         }, true })]
        public JsonResult GetCreditTypeBySection(int id)
        {
            try
            {
                List<CreditTypeGradeMapping> gradeMappings = _sectionGradeMappingService.GetCreditTypes(id);
                return Json(SerializationHelper.ToJsonResult(gradeMappings.ToViewModel(id, _sectionService, _settingService)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the picture of a person.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("Sections/Picture/{eventId}/{eventSubType}/{section}")]
        public async Task<ActionResult> Picture(SectionPicture sectionPicture)
        {
            try
            {
                FileStreamResult result = null;
                InstitutionSettings.ConEdRegistration conedRegistration = _institutionSettingService.GetConEdRegistration();
                if (conedRegistration?.ShowCoursePicture == true)
                {
                    PictureDir pictureDir = _codeTableService.GetPictureDirection(conedRegistration.Location);
                    if (pictureDir != null)
                    {
                        if (!string.Equals(pictureDir.PictureLocation.Substring(pictureDir.PictureLocation.Length - 1, 1), "/"))
                            pictureDir.PictureLocation = $"{pictureDir.PictureLocation}/";
                        Picture picture = new();
                        picture.FileExtension = $".{conedRegistration.FileExtension.ToLower()}";
                        picture.FileName = $"{sectionPicture.EventId}{sectionPicture.EventSubType}{sectionPicture.Section}{picture.FileExtension}";
                        picture.Url = $"{pictureDir.PictureLocation}{picture.FileName}";

                        return await _pictureHelper.GetPictureAsync(picture);
                    }
                }

                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Saves the activities.
        /// </summary>
        /// <param name="sectionAssignmentSetup">The section assignment setup.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/Activities/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementActivities,
            ClaimsConstants.DepartmentCourseManagementActivities
         }, true })]
        public JsonResult SaveActivities([FromBody] SectionAssignmentSetupModel sectionAssignmentSetup)
        {
            try
            {
                bool result = true;
                if (sectionAssignmentSetup != null)
                    result = _assignmentService.Update(sectionAssignmentSetup.SectionId, ToAssignmentTypes(sectionAssignmentSetup));
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, exception.Message, 0, false));
            }
        }

        /// <summary>
        /// Saves the activity.
        /// </summary>
        /// <param name="sectionAssignment">The section assignment.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/Activity/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementActivities,
            ClaimsConstants.DepartmentCourseManagementActivities
         }, true })]
        public JsonResult SaveActivity([FromBody] SectionAssignmentModel sectionAssignment)
        {
            try
            {
                bool result = _assignmentService.Save(ToAssignment(sectionAssignment), Account.PersonId, sectionAssignment.SectionId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, exception.Message, 0, false));
            }
        }

        /// <summary>
        /// Saves the apply defaults.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/GradeMappings/ApplyDefaults")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementGradeMappings,
            ClaimsConstants.DepartmentCourseManagementGradeMappings
         }, true })]
        public JsonResult SaveApplyDefaults([FromBody] int sectionId)
        {
            try
            {
                bool result = false;
                if (sectionId > 0)
                    result = _sectionGradeMappingService.ApplyInstitutionGradeMappings(sectionId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the copy activities.
        /// </summary>
        /// <param name="sourceSectionId">The source section identifier.</param>
        /// <param name="destinationSectionId">The destination section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/CopyActivities/Save")]
        public JsonResult SaveCopyActivities([FromBody] SaveCopyActivitiesModel saveCopyActivitiesModel)
        {
            try
            {
                int sourceSectionId = saveCopyActivitiesModel.SourceSectionId;
                int destinationSectionId = saveCopyActivitiesModel.DestinationSectionId;

                bool result = false;
                if (sourceSectionId > 0 && destinationSectionId > 0)
                    result = _assignmentService.Copy(sourceSectionId, destinationSectionId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets sections for grade mappings.
        /// </summary>
        /// <param name="saveSectionGradeMappingsModel">The save section grade mappings model.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("Sections/GradeMappings")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementGradeMappings,
            ClaimsConstants.DepartmentCourseManagementGradeMappings
         }, true })]
        public JsonResult SaveSectionGradeMappings([FromBody] SaveSectionGradeMappingsModel saveSectionGradeMappingsModel)
        {
            try
            {
                int sectionId = saveSectionGradeMappingsModel.SectionId;
                List<SectionGradeMapping> mappingList = saveSectionGradeMappingsModel.MappingList;

                List<SectionGradeMapping> mappingAddSectionList = new();
                List<SectionGradeMapping> mappingUpdateSectionList = new();
                foreach (SectionGradeMapping section in mappingList)
                {
                    if (section.MappingId != 0)
                        mappingUpdateSectionList.Add(section);
                    else
                        mappingAddSectionList.Add(section);
                }
                bool showMidTerm = _settingService.IsMidtermGradesEnabled();
                if (mappingUpdateSectionList.Count > 0)
                    _sectionGradeMappingService.Update(sectionId, mappingUpdateSectionList, showMidTerm);
                if (mappingAddSectionList.Count > 0)
                    _sectionGradeMappingService.Create(sectionId, mappingAddSectionList, showMidTerm);
                return Json(SerializationHelper.ToJsonResult(showMidTerm));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, exception.Message, 0, false));
            }
        }

        /// <summary>
        /// Updates the assignment weighting.
        /// </summary>
        /// <param name="sectionAssignment">The section assignment.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/Activities/Weight/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementActivities,
            ClaimsConstants.DepartmentCourseManagementActivities
         }, true })]
        public JsonResult UpdateAssignmentWeighting([FromBody] SectionAssignmentWeightModel sectionAssignment)
        {
            try
            {
                if (sectionAssignment == null)
                    return Json(SerializationHelper.ToJsonResult(null, "Invalid section assignment", 0, false));
                if (sectionAssignment.SectionId > 0)
                {
                    bool result = _assignmentService.UpdateWeighting(sectionAssignment.SectionId, sectionAssignment.WeightMethod, sectionAssignment.IsWeightByType);
                    return Json(SerializationHelper.ToJsonResult(result));
                }
                return Json(SerializationHelper.ToJsonResult(null, "Invalid sectionId", 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, exception.Message, 0, false));
            }
        }

        /// <summary>
        /// Validates the name of the activity.
        /// </summary>
        /// <param name="sectionAssignment">The section assignment.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/Activities/ValidateName")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementActivities,
            ClaimsConstants.DepartmentCourseManagementActivities
         }, true })]
        public JsonResult ValidateActivityName([FromBody] ActivityNameValidationModel sectionAssignment)
        {
            try
            {
                bool result = _assignmentService.IsValidName(sectionAssignment.SectionId, sectionAssignment.Id, sectionAssignment.Title);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, exception.Message, 0, false));
            }
        }

        #endregion Classes Setup

        #region Classes Grading

        /// <summary>
        /// Activities the grades.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [Route("Sections/{sectionId}/ActivityGrades")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementActivityGrades,
            ClaimsConstants.DepartmentCourseManagementActivityGrades
         }, true })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult ActivityGrades(int sectionId)
        {
            try
            {
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                SectionActivityGradesViewModel sectionActivityGrades = new();
                List<ListOptionViewModel> listOptionViewModels = _gradeActivityService.Get(sectionId).Assignments.ToViewModel();
                if (listOptionViewModels?.Count > 0)
                {
                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    sectionActivityGrades.EnableActivityGradeComments = _institutionSettingService.GetCourseManagement().EnableActivityGradeComments;
                    sectionActivityGrades.Activities = listOptionViewModels;
                    Assignment assignment = _gradeActivityService.GetDetail(sectionId, listOptionViewModels[0].Value);
                    sectionActivityGrades.ActivityGrade = assignment.ToViewModel(general);
                    List<StudentActivityGrade> studentActivityGrades = _gradeActivityService.GetByStudents(sectionId, listOptionViewModels[0].Value);
                    sectionActivityGrades.StudentsActivityGrade = studentActivityGrades.ToViewModel(CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial);
                    sectionActivityGrades.IsRestricted = _departmentService.IsRestrictedCourse(sectionId);
                    sectionActivityGrades.IsDateToday = assignment.GradeDueDate.HasValue && assignment.GradeDueDate.Value.Date < DateTime.Now.Date;
                }
                sectionActivityGrades.EmailSettings = new EmailSettingsViewModel
                {
                    Email = mail.Email,
                    CanEditRecipient = mail.CanEditRecipient,
                    CanEditSender = mail.CanEditSender,
                    EmailProvider = mail.EmailProvider,
                    Sender = mail.Sender,
                    StaffSeparator = mail.StaffSeparator,
                    StaffUrl = mail.StaffUrl,
                    StudentSeparator = mail.StudentSeparator,
                    StudentUrl = mail.StudentUrl
                };
                return Json(SerializationHelper.ToJsonResult(sectionActivityGrades));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, exception.Message, 0, false));
            }
        }

        /// <summary>
        /// Activities the grades.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="id">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [Route("Sections/{sectionId}/ActivityGrades/{id}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementActivityGrades,
            ClaimsConstants.DepartmentCourseManagementActivityGrades
         }, true })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult ActivityGrades(int sectionId, int id)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                SectionActivityGradesViewModel sectionActivityGradesViewModel = new();
                Assignment assignment = _gradeActivityService.GetDetail(sectionId, id);
                sectionActivityGradesViewModel.ActivityGrade = assignment.ToViewModel(general);
                List<StudentActivityGrade> studentActivityGrades = _gradeActivityService.GetByStudents(sectionId, id);
                sectionActivityGradesViewModel.StudentsActivityGrade = studentActivityGrades.ToViewModel(CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial);
                sectionActivityGradesViewModel.IsDateToday = assignment.GradeDueDate.HasValue && assignment.GradeDueDate.Value.Date < DateTime.Now.Date;
                return Json(SerializationHelper.ToJsonResult(sectionActivityGradesViewModel));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, exception.Message, 0, false));
            }
        }

        /// <summary>
        /// Activities the grades.
        /// </summary>
        /// <param name="activityGradesModel">The activity grades model.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("Sections/ActivityGrades")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementActivityGrades,
            ClaimsConstants.DepartmentCourseManagementActivityGrades
         }, true })]
        public JsonResult ActivityGrades([FromBody] ActivityGradesModel activityGradesModel)
        {
            try
            {
                int sectionId = activityGradesModel.SectionId;
                List<StudentActivityGradeModel> studentsActivityGrade = activityGradesModel.StudentsActivityGrade;

                bool result = false;
                bool enableActivityGradeComments = _institutionSettingService.GetCourseManagement().EnableActivityGradeComments;
                List<StudentActivityGrade> studentsActivityGradeDTO = null;
                if (studentsActivityGrade?.Count > 0)
                {
                    studentsActivityGradeDTO = studentsActivityGrade.Select(sag => new StudentActivityGrade
                    {
                        AssignmentId = sag.AssignmentId,
                        EarnedPoints = sag.EarnedPoints,
                        Grade = sag.Grade,
                        GradeReceived = FormatHelper.FromDatePicker(sag.GradeReceived),
                        InstructorComments = sag.InstructorComments,
                        StudentAssignmentId = sag.StudentAssignmentId,
                        StudentId = sag.StudentId
                    }).ToList();
                }

                result = _sectionService.SaveActivityGrades(sectionId, studentsActivityGradeDTO, Account.PersonId, enableActivityGradeComments);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, exception.Message, 0, false));
            }
        }

        /// <summary>
        /// Gets attendance list of the section
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [Route("Sections/Attendance/{id}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementOverallAttendance,
            ClaimsConstants.DepartmentCourseManagementOverallAttendance
         }, true })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Attendance(int id)
        {
            try
            {
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.CourseManagement courseManagement = _institutionSettingService.GetCourseManagement();
                SectionAttendance sectionAttendance = _sectionService.GetAttendance(id);
                return Json(SerializationHelper.ToJsonResult(sectionAttendance.ToViewModel(CurrentNameFormat, CurrentNameSort, general, mail,
                    courseManagement, ShowMiddleNameInitial)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Updates the specified attendance list.
        /// </summary>
        /// <param name="attendanceList">The attendance list.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Sections/Attendance")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementOverallAttendance,
            ClaimsConstants.DepartmentCourseManagementOverallAttendance
         }, true })]
        public JsonResult Attendance([FromBody] List<SectionAttendanceStudentViewModel> attendanceList)
        {
            try
            {
                bool result = false;
                if (attendanceList?.Count > 0)
                {
                    List<StudentAttendance> attendance = new();
                    attendanceList.ForEach(x => attendance.Add(
                        new StudentAttendance
                        {
                            StudentSectionAttendanceId = x.Id,
                            SectionAttendanceId = x.SectionAttendanceId == 0 ? null : x.SectionAttendanceId,
                            LastAttendedDate = string.IsNullOrEmpty(x.LastAttendedDate) ? null : FormatHelper.FromDatePicker(x.LastAttendedDate)
                        }));
                    result = _sectionService.SaveStudentAttendance(attendance);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Changes the options.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/OverallGrades/ChangeOptions")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementOverallGradesChangeTranscriptGrade,
            ClaimsConstants.DepartmentCourseManagementOverallGradesChangeTranscriptGrade
         }, true })]
        public JsonResult ChangeOptions()
        {
            try
            {
                SectionOverallGradesChangeViewModel sectionOverallGradesChange = new();
                bool isFinalGradeChangeReasonRequired = _gradeService.IsFinalGradeChangeReasonRequired();
                bool isMidtermGradeChangeReasonRequired = _gradeService.IsMidtermGradeChangeReasonRequired();
                List<ListOptionViewModel> gradeChangeReasons = _codeTableService.GetByName(CodeTableName.GradeChange, true).ToViewModel();
                if (gradeChangeReasons != null)
                    sectionOverallGradesChange.GradeChangeReasons = gradeChangeReasons;
                sectionOverallGradesChange.IsFinalGradeChangeReasonRequired = isFinalGradeChangeReasonRequired;
                sectionOverallGradesChange.IsMidtermGradeChangeReasonRequired = isMidtermGradeChangeReasonRequired;
                return Json(SerializationHelper.ToJsonResult(sectionOverallGradesChange));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Commentses the specified student grade identifier.
        /// </summary>
        /// <param name="studentGradeId">The student grade identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/OverallGrades/Comments")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementOverallGradesChangeTranscriptGrade,
            ClaimsConstants.DepartmentCourseManagementOverallGradesChangeTranscriptGrade
         }, true })]
        public JsonResult Comments([FromBody] int studentGradeId)
        {
            try
            {
                string narrativeGrade = _gradeService.GetNarrativeGrade(studentGradeId);
                return Json(SerializationHelper.ToJsonResult(narrativeGrade));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Creates the student grade.
        /// </summary>
        /// <param name="createStudentGradeModel">The create student grade model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/OverallGrades/Create")]
        public JsonResult CreateStudentGrade([FromBody] CreateStudentGradeModel createStudentGradeModel)
        {
            try
            {
                int transcriptDetailId = createStudentGradeModel.TranscriptDetailId;
                bool isMidterm = createStudentGradeModel.IsMidterm;

                int studentGradeId = _gradeService.Create(transcriptDetailId, isMidterm);
                return Json(SerializationHelper.ToJsonResult(studentGradeId));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Dailies the attendance.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/DailyAttendance")]
        public JsonResult DailyAttendance([FromBody] int id)
        {
            try
            {
                List<DateAttendance> calendarDates = _attendanceService.GetSectionMeetings(id);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(calendarDates.ToViewModel(general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Dailies the attendance.
        /// </summary>
        /// <param name="attendances">The attendances.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/DailyAttendance/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementDailyAttendance,
            ClaimsConstants.DepartmentCourseManagementDailyAttendance
         }, true })]
        public JsonResult DailyAttendance([FromBody] List<Attendance> attendances)
        {
            try
            {
                bool result = _attendanceService.Create(attendances);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Dailies the attendance batch.z
        /// </summary>
        /// <param name="attendance">The attendance.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/DailyAttendance/Batch")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementDailyAttendance,
            ClaimsConstants.DepartmentCourseManagementDailyAttendance
         }, true })]
        public JsonResult DailyAttendanceBatch([FromBody] Attendance attendance)
        {
            try
            {
                bool result = _attendanceService.CreateBatch(attendance);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Dailies the attendance hours.
        /// </summary>
        /// <param name="dailyAttendanceHoursModel">The daily attendance hours model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/DailyAttendanceHours")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult DailyAttendanceHours([FromBody] DailyAttendanceHoursModel dailyAttendanceHoursModel)
        {
            try
            {
                int id = dailyAttendanceHoursModel.Id;
                string calendarDate = dailyAttendanceHoursModel.CalendarDate;
                bool includeStudentList = dailyAttendanceHoursModel.IncludeStudentList;
                int? calendarKey = dailyAttendanceHoursModel.CalendarKey;

                if (id <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "The id is less or equal to zero.", 404, false));
                if (string.IsNullOrEmpty(calendarDate))
                    return Json(SerializationHelper.ToJsonResult(null, "The calendarDate is null or empty.", 404, false));
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                List<StudentMeetingAttendance> studentMeetingAttendances = null;
                DateTime date = (DateTime)FormatHelper.FromDatePicker(calendarDate);
                string longDate = FormatHelper.ToLongDate(date, datetimeCulture);
                List<SectionMeetingCalendar> sectionMeetingCalendars = _attendanceService.GetSectionMeetingHours(id, date);
                List<SectionMeetingCalendarViewModel> sectionMeetingCalendarViewModels = sectionMeetingCalendars.ToViewModel(general);

                List<ListOptionViewModel> listOptionViewModel = _codeTableService.GetByName(CodeTableName.AttendStatusDetail, true).ToViewModel(true);
                List<StudentMeetingAttendanceViewModel> studentMeetingAttendanceViewModels = null;
                if (includeStudentList)
                {
                    if (sectionMeetingCalendars.Count > 0)
                    {
                        if (calendarKey != 0)
                            studentMeetingAttendances = _attendanceService.GetSectionMeeting(id, (int)calendarKey);
                        else
                            studentMeetingAttendances = _attendanceService.GetSectionMeeting(id, sectionMeetingCalendars[0].CalendarKey);
                    }
                    studentMeetingAttendanceViewModels = studentMeetingAttendances.ToViewModel(CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial);
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    sectionMeetingCalendarViewModels,
                    studentMeetingAttendanceViewModels,
                    listOptionViewModel,
                    longDate,
                    calendarDate
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the violations by section.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [Route("Sections/Violations/{id}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementAlerts,
            ClaimsConstants.DepartmentCourseManagementAlerts
         }, true })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult GetViolationsBySection(int id)
        {
            try
            {
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                EmailSettingsViewModel emailSettings = new()
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
                };
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                SectionViolation sectionViolation = _violationService.GetBySection(id);
                List<ListOptionViewModel> violationTypes = _codeTableService.GetByName(CodeTableName.Violations, true).ToViewModel(true);
                List<SectionViolationViewModel> sectionViolations = sectionViolation.ToViewModel(CurrentNameFormat, CurrentNameSort, Account.PersonId, general, ShowMiddleNameInitial);
                string createdDate = FormatHelper.ToShortDate(DateTime.Today, datetimeCulture);
                string createdBy = _peopleService.Get(Account.PersonId).ToViewModel(CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial).FullName;
                return Json(SerializationHelper.ToJsonResult(new
                {
                    createdBy,
                    createdDate,
                    emailSettings,
                    sectionViolations,
                    violationTypes
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the overall grades.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [Route("Sections/OverallGrades/{id}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementOverallGrades,
            ClaimsConstants.DepartmentCourseManagementOverallGrades
         }, true })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult OverallGrades(int id)
        {
            try
            {
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                bool showProjectedGrade = _institutionSettingService.GetCourseManagement().EnableProjectedGrade;
                bool isApprovalRequired = _gradeService.IsApprovalRequired(id);
                SectionStudentGrade sectionStudentGrade = _sectionService.GetStudentGradesBySection(id, showProjectedGrade, Account.PersonId);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                SectionGradeValidationResult validationResult = _gradeService.ValidateAssignmentGrading(id);
                AssignmentDepartmentViewModel assignmentDepartment = _assignmentTemplateService.Get(id).ToViewModel(general.DateTimeCulture);
                IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity).Claims;
                bool hasAssignmentDepartment = assignmentDepartment != null;
                SectionOverallGradeListViewModel sectionOverallGradeList = sectionStudentGrade.ToViewModel(id, Account.PersonId, showProjectedGrade,
                    isApprovalRequired, CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial, _settingService, _sectionService,
                    _departmentHeadService, _facultyAssistantService);
                if (validationResult.CourseSetupStatus == CourseSetupStatus.Invalid)
                {
                    sectionOverallGradeList.Errors = new List<string>();
                    sectionOverallGradeList.SectionSetupStatus = 1;
                    foreach (SectionGradeValidationError error in validationResult.Errors)
                    {
                        if (error.FinalDropsWithUnequalWeights)
                            sectionOverallGradeList.Errors.Add($"You cannot drop the lowest or highest {error.AssignmentType} " +
                                "from the final grade, because the activities are not weighted equally.");
                        else if (error.MidtermDropsWithUnequalWeights)
                            sectionOverallGradeList.Errors.Add($"You cannot drop the lowest or highest {error.AssignmentType} " +
                                "from the midterm grade, because the activities are not weighted equally.");
                        else if (error.TooManyFinalDrops)
                            sectionOverallGradeList.Errors.Add("You have attempted to drop all of the activities " +
                                $"from the final grade for {error.AssignmentType}.");
                        else if (error.TooManyMidtermDrops)
                            sectionOverallGradeList.Errors.Add("You have attempted to drop all of the activities " +
                                $"from the midterm grade for {error.AssignmentType}.");
                    }
                }
                if (validationResult.CourseSetupStatus == CourseSetupStatus.NoAssignmentsExist)
                {
                    sectionOverallGradeList.ShowFinaltermCalculatedScore = false;
                    sectionOverallGradeList.ShowMidtermCalculatedScore = false;
                }
                if (sectionOverallGradeList.OverallGradeList != null)
                {
                    sectionOverallGradeList.ShowMidtermApply = sectionOverallGradeList.ShowMidtermGrade && sectionOverallGradeList.OverallGradeList
                      .FindAll(x => !string.IsNullOrEmpty(x.Midterm.CalculatedGrade)).Count > 0;

                    sectionOverallGradeList.ShowFinaltermApply = sectionOverallGradeList.OverallGradeList
                      .FindAll(x => !string.IsNullOrEmpty(x.Finalterm.CalculatedGrade)).Count > 0;
                }
                if (hasAssignmentDepartment)
                    sectionOverallGradeList.AssignmentDepartment = assignmentDepartment;

                sectionOverallGradeList.IsChangeGradeDepartment =
                    claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementOverallGradesChangeTranscriptGrade);
                sectionOverallGradeList.IsChangeGradeFaculty =
                    claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementOverallGradesChangeTranscriptGrade);

                sectionOverallGradeList.IsChangeGradeDepartment = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementOverallGradesChangeTranscriptGrade);
                sectionOverallGradeList.IsChangeGradeFaculty = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementOverallGradesChangeTranscriptGrade);
                sectionOverallGradeList.EmailSettings = new EmailSettingsViewModel
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
                };
                return Json(SerializationHelper.ToJsonResult(sectionOverallGradeList));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the calendar notes.
        /// </summary>
        /// <param name="saveCalendarNotesModel">The save calendar notes model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/CalendarNotes/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementDashboardNotes,
            ClaimsConstants.DepartmentCourseManagementDashbaordNotes
         }, true })]
        public JsonResult SaveCalendarNotes([FromBody] SaveCalendarNotesModel saveCalendarNotesModel)
        {
            try
            {
                int calendarKey = saveCalendarNotesModel.CalendarKey;
                string notes = saveCalendarNotesModel.Notes;

                if (calendarKey <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "The calendarKey is less or equal to zero.", 404, false));
                bool result = _attendanceService.UpdateCalendarNotes(calendarKey, notes);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the change grade.
        /// </summary>
        /// <param name="changeGrade">The change grade.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/OverallGrades/Change")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
           ClaimsConstants.ClassesFacultyCourseManagementOverallGradesChangeTranscriptGrade,
            ClaimsConstants.DepartmentCourseManagementOverallGradesChangeTranscriptGrade
         }, true })]
        public JsonResult SaveChangeGrade([FromBody] ChangeGrade changeGrade)
        {
            try
            {
                bool result = false;
                changeGrade.FacultyId = Account.PersonId;
                if (string.IsNullOrEmpty(changeGrade.Grade))
                    changeGrade.Grade = string.Empty;
                if (changeGrade.StudentGradeId > 0)
                    result = _gradeService.Update(changeGrade, Account.PersonId);
                return result ? Json(SerializationHelper.ToJsonResult(result)) : Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the student grade.
        /// </summary>
        /// <param name="saveStudentGradeModel">The save student grade model.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("Sections/OverallGrades")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementOverallGrades,
            ClaimsConstants.DepartmentCourseManagementOverallGrades
         }, true })]
        public JsonResult SaveStudentGrade([FromBody] SaveStudentGradeModel saveStudentGradeModel)
        {
            try
            {
                int sectionId = saveStudentGradeModel.SectionId;
                bool isSubmit = saveStudentGradeModel.IsSubmit;
                int submitType = saveStudentGradeModel.SubmitType;
                List<StudentOverallGradeViewModel> overallGradeList = saveStudentGradeModel.OverallGradeList;

                bool result = false;
                SectionSubmitStudentGrade submitStudentGradeDTO = new()
                {
                    IsSubmit = isSubmit,
                    SubmitType = submitType,
                    StudentGrades = new()
                };
                if (overallGradeList != null)
                {
                    foreach (StudentOverallGradeViewModel studentGradeViewModel in overallGradeList)
                    {
                        StudentGrade studentGradeDTO = new()
                        {
                            StudentId = studentGradeViewModel.StudentId
                        };
                        if (studentGradeViewModel.Midterm?.IsModified == true || !string.IsNullOrWhiteSpace(studentGradeViewModel.Midterm?.InstructorGrade))
                        {
                            studentGradeDTO.Midterm = new GradeDetail
                            {
                                InstructorComments = studentGradeViewModel.Midterm.InstructorComments,
                                StudentGradeId = studentGradeViewModel.Midterm.StudentGradeId,
                                TranscriptGrade = studentGradeViewModel.Midterm.InstructorGrade
                            };
                        }
                        if (studentGradeViewModel.Finalterm?.IsModified == true || !string.IsNullOrWhiteSpace(studentGradeViewModel.Finalterm?.InstructorGrade))
                        {
                            studentGradeDTO.Final = new GradeDetail
                            {
                                InstructorComments = studentGradeViewModel.Finalterm.InstructorComments,
                                StudentGradeId = studentGradeViewModel.Finalterm.StudentGradeId,
                                TranscriptGrade = studentGradeViewModel.Finalterm.InstructorGrade
                            };
                        }
                        submitStudentGradeDTO.StudentGrades.Add(studentGradeDTO);
                    }
                }
                result = _gradeService.SaveStudentGrades(sectionId, Account.PersonId, submitStudentGradeDTO);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the section meeting attendance.
        /// </summary>
        /// <param name="sectionMeetingAttendance">The section meeting attendance.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/StudentDailyAttendance")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementDailyAttendance,
            ClaimsConstants.DepartmentCourseManagementDailyAttendance
         }, true })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult SectionMeetingAttendance([FromBody] SectionMeetingAttendanceModel sectionMeetingAttendance)
        {
            try
            {
                int id = sectionMeetingAttendance.Id;
                int calendarKey = sectionMeetingAttendance.CalendarKey;

                if (id <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "The id is less or equal to zero.", 404, false));
                if (calendarKey <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "The calendarKey is less or equal to zero.", 404, false));
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<StudentMeetingAttendance> studentMeetingAttendances = _attendanceService.GetSectionMeeting(id, calendarKey);
                List<StudentMeetingAttendanceViewModel> studentMeetingAttendanceViewModels = studentMeetingAttendances.ToViewModel(CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial);
                return Json(SerializationHelper.ToJsonResult(new { studentMeetingAttendanceViewModels }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the statistics list.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [Route("Sections/Statistics/{id}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementOverallGrades,
            ClaimsConstants.DepartmentCourseManagementOverallGrades
         }, true })]
        public JsonResult Statistics(int id)
        {
            try
            {
                SectionStatistic sectionStatistic = _sectionService.GetStatistic(id);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    _institutionSettingService.GetCourseManagement().MidtermGrades,
                    sectionStatistic.StudentCount,
                    sectionStatistic = sectionStatistic.ToViewModel(general)
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Students the comments.
        /// </summary>
        /// <param name="sectionCommentModel">The section comment model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/OverallGrades/StudentComments")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementOverallGrades,
            ClaimsConstants.DepartmentCourseManagementOverallGrades
         }, true })]
        public JsonResult StudentComments([FromBody] SectionCommentModel sectionCommentModel)
        {
            try
            {
                if (sectionCommentModel?.PersonId <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "The personid is less or equal to zero.", 404, false));
                if (sectionCommentModel?.SectionId <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "The sectionid is less or equal to zero.", 404, false));
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                bool showMidterm = _institutionSettingService.GetCourseManagement().MidtermGrades;
                List<GradeCommentsDetailViewModel> comments = _gradeService.GetStudentComments(sectionCommentModel.PersonId, sectionCommentModel.SectionId).ToViewModel(CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial, general, showMidterm);
                return Json(SerializationHelper.ToJsonResult(comments));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Updates the student comments.
        /// </summary>
        /// <param name="comments">The comments.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/OverallGrades/StudentComments/Update")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.ClassesFacultyCourseManagementOverallGrades,
            ClaimsConstants.DepartmentCourseManagementOverallGrades
         }, true })]
        public JsonResult UpdateStudentComments([FromBody] List<GradeComment> comments)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                bool result = _gradeService.UpdateStudentComments(Account.PersonId, comments);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Classes Grading

        #region CourseTemplates

        /// <summary>
        /// Sections the assignment status.
        /// </summary>
        /// <param name="sectionAssignmentStatusModel">The section assignment status model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Sections/CourseTemplates")]
        public JsonResult SectionAssignmentStatus([FromBody] SectionAssignmentStatusModel sectionAssignmentStatusModel)
        {
            try
            {
                int startIndex = sectionAssignmentStatusModel.StartIndex;
                int length = sectionAssignmentStatusModel.Length;
                AssignmentSearch assignmentSearch = sectionAssignmentStatusModel.AssignmentSearch;

                assignmentSearch.PersonId = Account?.PersonId > 0 ? Account.PersonId : 0;
                SectionAssignments sectionAssignment = _sectionService.GetAssignmentStatus(startIndex, length, assignmentSearch);
                List<SectionAssignmentsViewModel> sectionAssignments = sectionAssignment.SectionAssignmentList.ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new { sectionAssignments, sectionAssignment.OverallCount }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CourseTemplatesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion CourseTemplates

        #region Private Methods

        /// <summary>
        /// To the section detail view model.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <returns>SectionDetailViewModel</returns>
        private string GetSectionPrerequisites(int sectionId, string nameFormat, bool showMiddleNameInitial)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                string language = _settingHelper.GetLanguage(Account);
                SectionDetail sectionDetail = _sectionService.GetDetail(sectionId);
                DegReqsResources degReqsResources = _resourcesHelper.GetServerResourceType<DegReqsResources>(language, "DegReqs", ValidationHelper.IsValidResource);
                sectionDetail.Prerequisites.ToViewModel(degReqsResources, out string prereqCondition, nameFormat, general, showMiddleNameInitial, out List<string> prereqConditionList);

                return prereqCondition;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return string.Empty;
            }
        }

        /// <summary>
        /// Searches the sections.
        /// </summary>
        /// <param name="sectionSearchParms">The section search parms.</param>
        /// <param name="isBasic">if set to <c>true</c> [is basic].</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="length">The length.</param>
        /// <param name="withIsCartable">if set to <c>true</c> [with is cartable].</param>
        /// <returns></returns>
        private SectionsListViewModel SearchSections(SectionSearch sectionSearchParms, bool isBasic,
            int? startIndex, int? length, bool withIsCartable)
        {
            try
            {
                SectionsListViewModel sectionsList = new();
                bool enableWaitList = false;
                InstitutionSettings.ConEdRegistration conEdRegistration = null;
                bool isConEd = string.Compare(sectionSearchParms.RegistrationType, "CONED", StringComparison.OrdinalIgnoreCase) == 0;
                if (isConEd)
                {
                    conEdRegistration = _institutionSettingService.GetConEdRegistration();
                    enableWaitList = conEdRegistration.EnableWaitList;
                }
                else
                {
                    enableWaitList = _institutionSettingService.GetRegistration().EnableWaitList;
                }

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                InstitutionSettings.Registration registration = _institutionSettingService.GetRegistration();
                Sections sections = null;
                sectionSearchParms.PersonId = (sectionSearchParms.PersonId ?? Account?.PersonId) ?? 0;
                sections = _sectionService.Get(sectionSearchParms, isBasic,
                    startIndex, length, withIsCartable, Account?.TemporaryUserId ?? 0, conEdRegistration);

                sectionsList.Sections = sections.ToViewModel(CurrentNameFormat, CurrentNameSort,
                    enableWaitList, general, ShowMiddleNameInitial, registration);
                sectionsList.OverallCount = sections.OverallCount;
                return sectionsList;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return new SectionsListViewModel
                {
                    Sections = new List<SectionViewModel>()
                };
            }
        }

        /// <summary>
        /// To the assignment.
        /// </summary>
        /// <param name="sectionAssignment">The section assignment.</param>
        /// <returns>Assignment</returns>
        private Assignment ToAssignment(SectionAssignmentModel sectionAssignment)
        {
            if (sectionAssignment == null)
                return null;

            return new Assignment
            {
                AssignedDate = FormatHelper.FromDatePicker(sectionAssignment.AssignedDate),
                AssignmentId = sectionAssignment.Id,
                AssignmentTitle = sectionAssignment.Title,
                AssignmentTypeId = sectionAssignment.Type,
                Description = sectionAssignment.Description,
                DueDate = FormatHelper.FromDatePicker(sectionAssignment.DueDate),
                FinalWeight = sectionAssignment.FinalWeight,
                IsExtraCredit = sectionAssignment.IsExtraCredit,
                MidtermWeight = sectionAssignment.MidtermWeight,
                PossiblePoints = sectionAssignment.PossiblePoints
            };
        }

        /// <summary>
        /// To the assignments.
        /// </summary>
        /// <param name="assignmentsModel">The assignments model.</param>
        /// <returns>List<Assignment></returns>
        private List<Assignment> ToAssignments(List<AssignmentModel> assignmentsModel)
        {
            List<Assignment> assignments = null;
            if (assignmentsModel?.Count > 0)
            {
                assignments = new List<Assignment>();
                foreach (AssignmentModel assignmentModel in assignmentsModel)
                {
                    assignments.Add(new Assignment
                    {
                        AssignmentId = assignmentModel.Id,
                        FinalWeight = assignmentModel.FinalWeight,
                        MidtermWeight = assignmentModel.MidtermWeight,
                        PossiblePoints = assignmentModel.PossiblePoints
                    });
                }
            }
            return assignments;
        }

        /// <summary>
        /// To the assignment types.
        /// </summary>
        /// <param name="sectionAssignmentSetup">The section assignment setup.</param>
        /// <returns>List<AssignmentType></returns>
        private List<AssignmentTypeRule> ToAssignmentTypes(SectionAssignmentSetupModel sectionAssignmentSetup)
        {
            List<AssignmentTypeRule> assignmentTypes = null;

            if (sectionAssignmentSetup?.AssignmentTypes?.Count > 0)
            {
                assignmentTypes = new List<AssignmentTypeRule>();

                foreach (AssignmentTypeModel item in sectionAssignmentSetup.AssignmentTypes)
                {
                    assignmentTypes.Add(new AssignmentTypeRule
                    {
                        Assignments = ToAssignments(item.Assignments),
                        AssignmentTypeId = item.Id,
                        FinalDropHighest = item.FinalDropHighest,
                        FinalDropLowest = item.FinalDropLowest,
                        FinalWeight = item.FinalWeight,
                        MidtermDropHighest = item.MidtermDropHighest,
                        MidtermDropLowest = item.MidtermDropLowest,
                        MidtermWeight = item.MidtermWeight
                    });
                }
            }

            return assignmentTypes;
        }

        /// <summary>
        /// To the section by period list.
        /// </summary>
        /// <param name="sections">The sections.</param>
        /// <returns>List<SectionByPeriodViewModel></returns>
        private List<SectionByPeriodViewModel> ToSectionByPeriodList(List<SectionViewModel> sections)
        {
            try
            {
                List<SectionViewModel> sectionsByPeriod = sections.OrderByDescending(x => x.Year).ThenBy(x => x.TermSort)
                    .GroupBy(x => new { x.Year, x.Term, x.Session })
                    .Select(svm => new SectionViewModel
                    {
                        Year = svm.Key.Year,
                        Term = svm.Key.Term,
                        Session = svm.Key.Session
                    }).ToList();
                List<SectionByPeriodViewModel> sectionsByEventId = new();
                SectionByPeriodViewModel sectionByPeriod = null;

                // Periods for registration
                List<Period> periodsRegistration = null;
                if (Account?.PersonId > 0)
                    _periodService.GetForRegistration(
                        Account.PersonId, out periodsRegistration,
                        out List<Period> periodsSectionSearch, out Period currentPeriod);
                Period periodTemp;
                foreach (SectionViewModel sectionViewModel in sectionsByPeriod)
                {
                    SectionViewModel svm =
                        sections.Find(x => (x.Year == sectionViewModel.Year && x.Term == sectionViewModel.Term && x.Session == sectionViewModel.Session));
                    if (svm != null)
                    {
                        sectionByPeriod = new SectionByPeriodViewModel
                        {
                            EnableCart = false,
                            Period = $"{svm.Year}/{svm.TermDesc}/{svm.SessionDesc}",
                            Sections = new List<SectionViewModel>()
                        };

                        if (periodsRegistration?.Count > 0)
                        {
                            periodTemp = periodsRegistration.Find(pr => pr.Year == svm.Year && pr.TermCode == svm.Term);
                            if (periodTemp != null && periodTemp.AuthorizationStatus != AuthorizationStatus.PeriodEnded)
                                sectionByPeriod.EnableCart = true;
                        }

                        sectionByPeriod.Sections =
                            sections.FindAll(x => (x.Year == sectionViewModel.Year && x.Term == sectionViewModel.Term && x.Session == sectionViewModel.Session)).ToList();
                        sectionsByEventId.Add(sectionByPeriod);
                    }
                }
                return sectionsByEventId;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return new List<SectionByPeriodViewModel>();
            }
        }

        #endregion Private Methods
    }
}