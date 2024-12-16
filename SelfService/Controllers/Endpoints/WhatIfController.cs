// --------------------------------------------------------------------
// <copyright file="WhatIfController.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Account;
using SelfService.Models.WhatIf;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /WhatIf route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class WhatIfController : BaseEndpointController
    {
        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<WhatIfController> _logger;

        /// <summary>
        /// The period services
        /// </summary>
        private readonly IPeriodService _periodService;

        /// <summary>
        /// The plan service
        /// </summary>
        private readonly IPlanningService _planningService;

        /// <summary>
        /// The degree service
        /// </summary>
        private readonly IWhatIfService _whatIfService;

        /// <summary>
        /// Initializes a new instance of the <see cref="WhatIfController"/> class.
        /// </summary>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="periodService">The period service.</param>
        /// <param name="planningService">The planning service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="whatIfService">The what if service.</param>
        /// <param name="logger">The logger.</param>
        public WhatIfController(
            IInstitutionSettingService institutionSettingService,
            IPeriodService periodService,
            IPlanningService planningService,
            ISerializationHelper serializationHelper,
            IWhatIfService whatIfService,
            IAppLogger<WhatIfController> logger)
            : base(serializationHelper)
        {
            _institutionSettingService = institutionSettingService;
            _periodService = periodService;
            _planningService = planningService;
            _whatIfService = whatIfService;

            _logger = logger;
        }

        /// <summary>
        /// Availables the specified model.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("WhatIf/Available")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult Available([FromBody] ImpersonateModel model)
        {
            try
            {
                int id = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                List<WhatIfPlan> whatIfs = _whatIfService.GetPlans(id);
                List<WhatIfPlanHeaderViewModel> whatIfPlans = null;
                if (whatIfs?.Count > 0)
                {
                    decimal creditsCompleted = 0;
                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    whatIfPlans = new List<WhatIfPlanHeaderViewModel>();
                    IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
                    foreach (WhatIfPlan whatIfPlan in whatIfs)
                    {
                        creditsCompleted = whatIfPlan.CreditsTaken != 0 && whatIfPlan.CreditMin > 0
                            ? whatIfPlan.CreditsTaken * 100 / whatIfPlan.CreditMin
                            : 0;
                        whatIfPlans.Add(new WhatIfPlanHeaderViewModel
                        {
                            CreditsCompleted = FormatHelper.ToDecimal(creditsCompleted, formatProvider),
                            CreditsCompletedValue = creditsCompleted,
                            CurriculumDesc = whatIfPlan.CurriculumDesc,
                            CurriculumCode = whatIfPlan.CurriculumCode,
                            DegreeDesc = whatIfPlan.Description,
                            DegreeCode = whatIfPlan.Code,
                            ProgramDesc = whatIfPlan.ProgramDesc,
                            ProgramCode = whatIfPlan.CodeProgram,
                            TermDesc = whatIfPlan.TermDesc,
                            TermCode = whatIfPlan.Term,
                            TermPeriodId = whatIfPlan.Id,
                            Year = whatIfPlan.Year
                        });
                    }
                }
                int maxNumberPlans = _institutionSettingService.GetStudentRecords().MaximumNumberPlans;
                return Json(SerializationHelper.ToJsonResult(new
                {
                    maxNumberPlans,
                    whatIfPlans
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(WhatIfController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Creates the specified what if plan.
        /// </summary>
        /// <param name="whatIfPlan">The what if plan.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("WhatIf/Create")]
        public JsonResult Create([FromBody] WhatIfPlanModel whatIfPlan)
        {
            try
            {
                if (whatIfPlan is null)
                    throw new ArgumentNullException(nameof(whatIfPlan));

                int id = whatIfPlan.ImpersonateInfo?.PersonId > 0 ? whatIfPlan.ImpersonateInfo.PersonId : Account.PersonId;
                if (whatIfPlan.TermPeriodId <= 0)
                    return Json(SerializationHelper.ToJsonResult(new { whatIfPlan.TermPeriodId }, string.Empty, 0, false));
                if (id <= 0)
                    return Json(SerializationHelper.ToJsonResult(new { id }, string.Empty, 0, false));
                int maxNumberPlans = _institutionSettingService.GetStudentRecords().MaximumNumberPlans;
                List<WhatIfPlan> whatIfs = _whatIfService.GetPlans(id);
                if (whatIfs != null && whatIfs.Count >= maxNumberPlans)
                    return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
                TermPeriod period = _periodService.GetYearTerm(whatIfPlan.TermPeriodId);
                bool result = _whatIfService.Create((int)id, period.Year,
                    period.TermCode, whatIfPlan.Program, whatIfPlan.Degree, whatIfPlan.Curriculum);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(WhatIfController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the specified what if plan.
        /// </summary>
        /// <param name="whatIfPlan">The what if plan.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("WhatIf/Delete")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult Delete([FromBody] WhatIfPlanModel whatIfPlan)
        {
            try
            {
                if (whatIfPlan is null)
                    throw new ArgumentNullException(nameof(whatIfPlan));

                int id = whatIfPlan.ImpersonateInfo?.PersonId > 0 ? whatIfPlan.ImpersonateInfo.PersonId : Account.PersonId;
                if (whatIfPlan.TermPeriodId <= 0)
                    return Json(SerializationHelper.ToJsonResult(new { whatIfPlan.TermPeriodId }, string.Empty, 0, false));
                if (id <= 0)
                    return Json(SerializationHelper.ToJsonResult(new { id }, string.Empty, 0, false));
                TermPeriod period = _periodService.GetYearTerm(whatIfPlan.TermPeriodId);
                bool result = _whatIfService.Delete((int)id, period.Year,
                    period.TermCode, whatIfPlan.Program, whatIfPlan.Degree, whatIfPlan.Curriculum);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(WhatIfController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Indexes the specified what if plan.
        /// </summary>
        /// <param name="whatIfPlan">The what if plan.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("WhatIf")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult Index([FromBody] WhatIfPlanModel whatIfPlan)
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                bool showSequence = false;

                if (whatIfPlan is null)
                    throw new ArgumentNullException(nameof(whatIfPlan));

                int id = whatIfPlan.ImpersonateInfo?.PersonId > 0 ? whatIfPlan.ImpersonateInfo.PersonId : Account.PersonId;
                if (whatIfPlan.TermPeriodId <= 0)
                    return Json(SerializationHelper.ToJsonResult(new { whatIfPlan.TermPeriodId }, string.Empty, 0, false));
                if (string.IsNullOrEmpty(whatIfPlan.Program))
                    return Json(SerializationHelper.ToJsonResult(null, "The program cannot be null or empty", 0, false));
                if (string.IsNullOrEmpty(whatIfPlan.Degree))
                    return Json(SerializationHelper.ToJsonResult(null, "The degree cannot be null or empty", 0, false));
                if (string.IsNullOrEmpty(whatIfPlan.Curriculum))
                    return Json(SerializationHelper.ToJsonResult(null, "The curriculum cannot be null or empty", 0, false));
                TermPeriod period = _periodService.GetYearTerm(whatIfPlan.TermPeriodId);
                StudentDegreeRequirement studentDegreeRequirement =
                    _planningService.GetAcademicPlan(id, true, period.Year, period.TermCode, whatIfPlan.Program,
                    whatIfPlan.Degree, whatIfPlan.Curriculum, AcademicPlanView.AcademicPlan);

                studentDegreeRequirement.SectionsNotCounted =
                    _whatIfService.GetNotCountedSections(id, period.Year, period.TermCode, whatIfPlan.Program, whatIfPlan.Degree,
                    whatIfPlan.Curriculum);
                showSequence = _institutionSettingService.GetStudentRecords().ShowSequence;

                return Json(SerializationHelper.ToJsonResult(new
                {
                    showSequence,
                    studentDegreeRequirement = studentDegreeRequirement.ToViewModel(general)
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(WhatIfController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}