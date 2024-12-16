// --------------------------------------------------------------------
// <copyright file="GradeMappingsController.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.GradeMappings;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// GradeMappingsController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class GradeMappingsController : BaseEndpointController
    {
        /// <summary>
        /// The department head service
        /// </summary>
        private readonly IDepartmentHeadService _departmentHeadService;

        /// <summary>
        /// The institution grade mapping service
        /// </summary>
        private readonly IInstitutionGradeMappingService _institutionGradeMappingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<GradeMappingsController> _logger;

        /// <summary>
        /// The period service
        /// </summary>
        private readonly IPeriodService _periodService;

        /// <summary>
        /// The section grade mapping service
        /// </summary>
        private readonly ISectionGradeMappingService _sectionGradeMappingService;

        /// <summary>
        /// The section service
        /// </summary>
        private readonly ISectionService _sectionService;

        /// <summary>
        /// The setting service
        /// </summary>
        private readonly ISettingService _settingService;

        /// <summary>
        /// Initializes a new instance of the <see cref="GradeMappingsController"/> class.
        /// </summary>
        /// <param name="departmentHeadService">The department head service.</param>
        /// <param name="institutionGradeMappingService">The institution grade mapping service.</param>
        /// <param name="periodService">The period service.</param>
        /// <param name="sectionGradeMappingService">The section grade mapping service.</param>
        /// <param name="sectionService">The section service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingService">The setting service.</param>
        /// <param name="logger">The logger.</param>
        public GradeMappingsController(
           IDepartmentHeadService departmentHeadService,
           IInstitutionGradeMappingService institutionGradeMappingService,
           IPeriodService periodService,
           ISectionGradeMappingService sectionGradeMappingService,
           ISectionService sectionService,
           ISerializationHelper serializationHelper,
           ISettingService settingService,
           IAppLogger<GradeMappingsController> logger)
           : base(serializationHelper)
        {
            _departmentHeadService = departmentHeadService;
            _institutionGradeMappingService = institutionGradeMappingService;
            _periodService = periodService;
            _sectionGradeMappingService = sectionGradeMappingService;
            _sectionService = sectionService;
            _settingService = settingService;

            _logger = logger;
        }

        /// <summary>
        /// Copies the grade mappings.
        /// </summary>
        /// <param name="sectionId">The section identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GradeMappings/Copy/Periods")]
        public JsonResult CopyGradeMappings([FromBody] int sectionId)
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
                        sectionPeriods = _departmentHeadService.GetCourses(Account.PersonId, (int)defaultSessionPeriod.SessionPeriodId, 1);
                    }
                }
                else if (CurrentLinkId == "FacultyCourseManagementId")
                {
                    sessionPeriods = _departmentHeadService.GetFacultyPeriods(Account.PersonId);
                    if (sessionPeriods?.Count > 0)
                    {
                        defaultSessionPeriod = _periodService.GetDefault(sessionPeriods);
                        sectionPeriods = _departmentHeadService.GetFacultyCourses(Account.PersonId, (int)defaultSessionPeriod.SessionPeriodId, 1);
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
        /// Courseses the specified section identifier.
        /// </summary>
        /// <param name="copyCoursesModel">The copy courses model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GradeMappings/Copy/Courses")]
        public JsonResult Courses([FromBody] CopyCoursesModel copyCoursesModel)
        {
            try
            {
                int sectionId = copyCoursesModel.SectionId;
                int sessionPeriodId = copyCoursesModel.SessionPeriodId;

                List<SectionPeriod> sectionsDTO = _departmentHeadService.GetFacultyCourses(Account.PersonId, sessionPeriodId, 1);
                sectionsDTO = sectionsDTO.Where(x => x.Id != sectionId).ToList();
                List<ListOptionViewModel> sections = new();
                if (sectionsDTO.Count > 0)
                    sections = sectionsDTO.ToViewModel();

                return Json(SerializationHelper.ToJsonResult(sections));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Indexes this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("GradeMappings")]
        public JsonResult Index()
        {
            try
            {
                List<CreditTypeGradeMapping> gradeMappings = _institutionGradeMappingService.GetCreditTypes();
                return Json(SerializationHelper.ToJsonResult(gradeMappings.ToViewModel(0, _sectionService, _settingService)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(GradeMappingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified grade mapping.
        /// </summary>
        /// <param name="gradeMappings">The grade mappings.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GradeMappings/Save")]
        public JsonResult Save([FromBody] List<GradeMapping> gradeMappings)
        {
            try
            {
                bool result = false;
                if (gradeMappings.Count > 0)
                    result = _institutionGradeMappingService.Save(gradeMappings);
                bool showMidTerm = _settingService.IsMidtermGradesEnabled();
                return Json(SerializationHelper.ToJsonResult(new { result, showMidTerm }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(GradeMappingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the copy grade mappings.
        /// </summary>
        /// <param name="saveCopyModel">The save copy model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GradeMappings/Copy/Save")]
        public JsonResult SaveCopyGradeMappings([FromBody] SaveCopyModel saveCopyModel)
        {
            try
            {
                int sourceSectionId = saveCopyModel.SourceSectionId;
                int destinationSectionId = saveCopyModel.DestinationSectionId;

                bool result = false;
                if (sourceSectionId > 0 && destinationSectionId > 0)
                    result = _sectionGradeMappingService.Copy(sourceSectionId, destinationSectionId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(GradeMappingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}