// --------------------------------------------------------------------
// <copyright file="AcademicPlansController.cs" company="Ellucian">
//     Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
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
using System;
using System.Collections.Generic;
using System.Linq;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /AcademicPlans route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class AcademicPlansController : BaseEndpointController
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
        private readonly IAppLogger<AcademicPlansController> _logger;

        /// <summary>
        /// The name format service
        /// </summary>
        private readonly INameFormatService _nameFormatService;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The planning service
        /// </summary>
        private readonly IPlanningService _planningService;

        /// <summary>
        /// The report helper
        /// </summary>
        private readonly IReportHelper _reportHelper;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="AcademicPlansController"/> class.
        /// </summary>
        /// <param name="academicService">The academic service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="nameFormatService">The name format service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="planningService">The planning service.</param>
        /// <param name="reportHelper">The report helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="logger">The logger.</param>
        public AcademicPlansController(
            IAcademicService academicService,
            IInstitutionSettingService institutionSettingService,
            INameFormatService nameFormatService,
            IPeopleService peopleService,
            IPlanningService planningService,
            IReportHelper reportHelper,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            IAppLogger<AcademicPlansController> logger)
            : base(serializationHelper)
        {
            _academicService = academicService;
            _institutionSettingService = institutionSettingService;
            _nameFormatService = nameFormatService;
            _peopleService = peopleService;
            _planningService = planningService;
            _reportHelper = reportHelper;
            _settingHelper = settingHelper;

            _logger = logger;
        }

        /// <summary>
        /// Gets the available academic plans.
        /// </summary>
        /// <param name="model">The impersonate model.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult Available([FromBody] ImpersonateModel model)
        {
            try
            {
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                List<AcademicPlan> degreesDTO = _planningService.GetAvailablePlans(personId);

                if (degreesDTO.Count > 0)
                    return Json(SerializationHelper.ToJsonResult(degreesDTO.OrderByDescending(d => int.Parse(d.Year)).ToList()));

                return Json(SerializationHelper.ToJsonResult(degreesDTO));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AcademicPlansController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the default academic plan.
        /// </summary>
        /// <param name="model">The impersonate model.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ImpersonateAttribute))]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Default([FromBody] ImpersonateModel model)
        {
            try
            {
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                string expectedGraduationDate = string.Empty;
                string graduationPeriod = string.Empty;
                bool showSequence = false;
                string email = string.Empty;
                AcademicPlan academicPlan = GetDefaultAcademicPlan(personId);
                StudentDegreeRequirement studentDegreeRequirement = null;
                People advisorInfo = null;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                if (academicPlan?.Programs != null)
                {
                    studentDegreeRequirement = _planningService.GetAcademicPlan(personId, false, academicPlan.Year, academicPlan.TermCode, academicPlan.Programs[0].ProgramCode,
                       academicPlan.Programs[0].Degrees[0].DegreeCode, academicPlan.Programs[0].Degrees[0].CurriculumCode, AcademicPlanView.AcademicPlan);
                    studentDegreeRequirement.SectionsNotCounted = _planningService.GetNotCountedSections(personId, academicPlan.Year, academicPlan.TermCode,
                        academicPlan.Programs[0].ProgramCode, academicPlan.Programs[0].Degrees[0].DegreeCode, academicPlan.Programs[0].Degrees[0].CurriculumCode);
                    studentDegreeRequirement.TermCode = academicPlan.TermCode;
                    studentDegreeRequirement.ProgramCode = academicPlan.Programs[0].ProgramCode;
                    studentDegreeRequirement.DegreeCode = academicPlan.Programs[0].Degrees[0].DegreeCode;
                    studentDegreeRequirement.CurriculumCode = academicPlan.Programs[0].Degrees[0].CurriculumCode;

                    Academic graduationInfo = _academicService.GetGraduationInfo(personId, academicPlan.Year, academicPlan.TermCode, academicPlan.Programs[0].ProgramCode,
                       academicPlan.Programs[0].Degrees[0].DegreeCode, academicPlan.Programs[0].Degrees[0].CurriculumCode);
                    if (graduationInfo != null)
                    {
                        expectedGraduationDate = !string.IsNullOrEmpty(graduationInfo.ExpectedGradYear) ? graduationInfo.ExpectedGradMonth + "/" + graduationInfo.ExpectedGradYear : string.Empty;
                        graduationPeriod = !string.IsNullOrEmpty(graduationInfo.GraduatedYear) ? graduationInfo.GraduatedYear + "/" +
                            graduationInfo.GraduatedTerm + "/" + graduationInfo.GraduatedSession : string.Empty;
                    }
                    advisorInfo = _academicService.GetAdvisorForAcademicPlan(personId, academicPlan.Year, academicPlan.TermCode, academicPlan.Programs[0].ProgramCode,
                                           academicPlan.Programs[0].Degrees[0].DegreeCode, academicPlan.Programs[0].Degrees[0].CurriculumCode);
                    if (advisorInfo != null)
                        email = advisorInfo.Email;
                    showSequence = _institutionSettingService.GetStudentRecords().ShowSequence;
                }
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    academicPlan,
                    advisorInfo?.ToViewModel(CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial).FullName,
                    email,
                    expectedGraduationDate,
                    graduationPeriod,
                    showSequence,
                    studentDegreeRequirement = studentDegreeRequirement.ToViewModel(general),
                    studentMailToUrl = mail.StudentUrl
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AcademicPlansController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Indexes the specified academic plan model.
        /// </summary>
        /// <param name="model">The academic plan model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("AcademicPlans")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Index([FromBody] AcademicPlanModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                string year = model.Year;
                string term = model.Term;
                string program = model.Program;
                string degree = model.Degree;
                string curriculum = model.Curriculum;
                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                bool showSequence = false;
                string email = string.Empty;
                People advisorInfo = null;
                string expectedGraduationDate = string.Empty;
                string graduationPeriod = string.Empty;

                if (string.IsNullOrEmpty(year))
                    return Json(SerializationHelper.ToJsonResult(null, "The year cannot be null or empty", 0, false));

                if (string.IsNullOrEmpty(term))
                    return Json(SerializationHelper.ToJsonResult(null, "The term cannot be null or empty", 0, false));

                if (string.IsNullOrEmpty(program))
                    return Json(SerializationHelper.ToJsonResult(null, "The program cannot be null or empty", 0, false));

                if (string.IsNullOrEmpty(degree))
                    return Json(SerializationHelper.ToJsonResult(null, "The degree cannot be null or empty", 0, false));

                if (string.IsNullOrEmpty(curriculum))
                    return Json(SerializationHelper.ToJsonResult(null, "The curriculum cannot be null or empty", 0, false));

                StudentDegreeRequirement studentDegreeRequirement =
                    _planningService.GetAcademicPlan(personId, false, year, term, program, degree, curriculum, AcademicPlanView.AcademicPlan);

                studentDegreeRequirement.SectionsNotCounted =
                    _planningService.GetNotCountedSections(personId, year, term, program, degree, curriculum);
                Academic graduationInfo = _academicService.GetGraduationInfo(personId, year, term, program, degree, curriculum);
                if (graduationInfo != null)
                {
                    expectedGraduationDate = !string.IsNullOrEmpty(graduationInfo.ExpectedGradYear) ? graduationInfo.ExpectedGradMonth + "/" + graduationInfo.ExpectedGradYear : string.Empty;
                    graduationPeriod = !string.IsNullOrEmpty(graduationInfo.GraduatedYear) ? graduationInfo.GraduatedYear + "/" +
                        graduationInfo.GraduatedTerm + "/" + graduationInfo.GraduatedSession : string.Empty;
                }
                advisorInfo = _academicService.GetAdvisorForAcademicPlan(personId, year, term, program, degree, curriculum);
                if (advisorInfo != null)
                    email = advisorInfo.Email;
                showSequence = _institutionSettingService.GetStudentRecords().ShowSequence;
                InstitutionSettings.Mail mail = _institutionSettingService.GetMail();

                return Json(SerializationHelper.ToJsonResult(new
                {
                    degree,
                    expectedGraduationDate,
                    graduationPeriod,
                    showSequence,
                    advisorInfo?.ToViewModel(CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial).FullName,
                    email,
                    studentDegreeRequirement = studentDegreeRequirement.ToViewModel(general),
                    studentMailToUrl = mail.StudentUrl
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AcademicPlansController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the academic plan report.
        /// </summary>
        /// <param name="model">The academic plan model.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("AcademicPlans/Report")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public ActionResult Report(AcademicPlanModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                bool showSequence = false;
                string expectedGraduationDate = string.Empty;
                string graduationPeriod = string.Empty;
                string language = _settingHelper.GetLanguage(Account);

                StudentDegreeRequirement studentDegreeRequirement =
                    _planningService.GetAcademicPlan(personId, false,
                    model.Year, model.Term, model.Program, model.Degree, model.Curriculum, AcademicPlanView.AcademicPlan);

                studentDegreeRequirement.SectionsNotCounted =
                    _planningService.GetNotCountedSections(personId, model.Year, model.Term, model.Program, model.Degree, model.Curriculum);
                Academic graduationInfo = _academicService.GetGraduationInfo(personId,
                    model.Year, model.Term, model.Program, model.Degree, model.Curriculum);
                if (graduationInfo != null)
                {
                    expectedGraduationDate = !string.IsNullOrEmpty(graduationInfo.ExpectedGradYear) ? graduationInfo.ExpectedGradMonth + "/" + graduationInfo.ExpectedGradYear : string.Empty;
                    graduationPeriod = !string.IsNullOrEmpty(graduationInfo.GraduatedYear) ? graduationInfo.GraduatedYear + "/" +
                        graduationInfo.GraduatedTerm + "/" + graduationInfo.GraduatedSession : string.Empty;
                }
                showSequence = _institutionSettingService.GetStudentRecords().ShowSequence;

                People people = _peopleService.Get(personId);
                string currentNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.General);
                string currentNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.General);
                bool showMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.General);
                string studentName = people.ToViewModel(currentNameFormat, currentNameSort, showMiddleNameInitial).FullName;

                AcademicPlanReportModel academicPlanReport = new()
                {
                    ExpectedGraduationDate = expectedGraduationDate,
                    GraduationPeriod = graduationPeriod,
                    ShowSequence = showSequence,
                    StudentDegreeRequirement = studentDegreeRequirement.ToViewModel(general),
                    StudentName = studentName
                };
                byte[] report = _reportHelper.GetAcademicPlan(academicPlanReport, language);
                return File(report, "application/pdf", "AcademicPlan.pdf");
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AcademicPlansController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

        /// <summary>
        /// Takens the course detail.
        /// </summary>
        /// <param name="model">The academic plan section model.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ImpersonateAttribute))]
        [Route("AcademicPlans/TakenCourseDetail")]
        public JsonResult TakenCourseDetail([FromBody] AcademicPlanSectionModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                string formatCredits = _institutionSettingService.GetGeneral().Credits;
                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                TakenCourseEvent takenCourseEvent =
                    _planningService.GetTakenCourseDetail(personId, model.Year, model.Term,
                    model.Session, model.EventId, model.SubType,
                    model.Section, model.Status);
                return Json(SerializationHelper.ToJsonResult(takenCourseEvent.ToViewModel(model.Status, formatCredits)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AcademicPlansController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #region Private Methods

        /// <summary>
        /// Gets the default academic plan.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        private AcademicPlan GetDefaultAcademicPlan(int personId)
        {
            try
            {
                AcademicPlanProgram academicPlanProgram = null;
                AcademicPlan defaultAcademicPlan = null;

                List<AcademicPlan> academicPlanList = _planningService.GetAvailablePlans(personId);
                Academic primaryAcademic = _academicService.GetPrimary(personId);
                if (primaryAcademic != null)
                {
                    List<AcademicPlan> academicPlansFound = academicPlanList.FindAll(
                        x => x.Year == primaryAcademic.MatricYear
                        && x.TermCode == primaryAcademic.MatricTermCode).ToList();
                    foreach (AcademicPlan academicPlan in academicPlansFound)
                    {
                        AcademicPlanProgram planProgram = academicPlan.Programs.Find(x => x.ProgramCode == primaryAcademic.Program);
                        if (planProgram != null)
                        {
                            AcademicPlanDegree planDegree = planProgram.Degrees.Find(x => x.DegreeCode == primaryAcademic.Degree && x.CurriculumCode == primaryAcademic.Curriculum);
                            if (planDegree != null)
                            {
                                defaultAcademicPlan = new AcademicPlan
                                {
                                    Id = academicPlan.Id,
                                    TermCode = academicPlan.TermCode,
                                    TermDesc = academicPlan.TermDesc,
                                    TermSortOrder = academicPlan.TermSortOrder,
                                    Year = academicPlan.Year
                                };
                                defaultAcademicPlan.Programs = new List<AcademicPlanProgram> { planProgram };
                                defaultAcademicPlan.Programs[0].Degrees = new List<AcademicPlanDegree> { planDegree };
                                return defaultAcademicPlan;
                            }
                        }
                    }
                }

                if (academicPlanList?.Count > 0)
                    defaultAcademicPlan = academicPlanList.OrderByDescending(d => int.Parse(d.Year)).First();
                if (defaultAcademicPlan?.Programs?.Count > 0)
                {
                    academicPlanProgram = defaultAcademicPlan.Programs.OrderBy(p => p.Id).First();
                    defaultAcademicPlan.Programs = new List<AcademicPlanProgram> { academicPlanProgram };
                }
                return defaultAcademicPlan;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AcademicPlansController).FullName, exception.Message, exception);
                return null;
            }
        }

        #endregion Private Methods
    }
}