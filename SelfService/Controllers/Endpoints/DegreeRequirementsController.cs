// --------------------------------------------------------------------
// <copyright file="DegreeRequirementsController.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.DegreeRequirements;
using System;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /DegreeRequirements route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class DegreeRequirementsController : BaseEndpointController
    {
        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<DegreeRequirementsController> _logger;

        /// <summary>
        /// The planning service
        /// </summary>
        private readonly IPlanningService _planningService;

        /// <summary>
        /// Initializes a new instance of the <see cref="DegreeRequirementsController"/> class.
        /// </summary>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="planningService">The planning service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public DegreeRequirementsController(
            IInstitutionSettingService institutionSettingService,
            IPlanningService planningService,
            ISerializationHelper serializationHelper,
            IAppLogger<DegreeRequirementsController> logger)
            : base(serializationHelper)
        {
            _institutionSettingService = institutionSettingService;
            _planningService = planningService;

            _logger = logger;
        }

        /// <summary>
        /// Degrees the requirements.
        /// </summary>
        /// <param name="degreeRequirementModel">The degree requirement model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("DegreeRequirements/DegreeRequirements")]
        [AllowAnonymous]
        public JsonResult DegreeRequirements([FromBody] DegreeRequirementModel degreeRequirementModel)
        {
            try
            {
                string yearTerm = degreeRequirementModel.YearTerm ?? string.Empty;
                string program = degreeRequirementModel.Program ?? string.Empty;
                string degree = degreeRequirementModel.Degree ?? string.Empty;
                bool showSequence = false;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                if (string.IsNullOrEmpty(yearTerm.Trim()))
                    return Json(SerializationHelper.ToJsonResult(new { degree }, string.Empty, 0, false));
                if (string.IsNullOrEmpty(program.Trim()))
                    return Json(SerializationHelper.ToJsonResult(new { degree }, string.Empty, 0, false));
                if (string.IsNullOrEmpty(degree.Trim()))
                    return Json(SerializationHelper.ToJsonResult(new { degree }, string.Empty, 0, false));

                string[] yearTermArray = yearTerm.Split('/');
                string[] degreeArray = degree.Split('/');
                if (yearTermArray?.Length > 0 && program?.Length > 0)
                {
                    StudentDegreeRequirement studentDegreeRequirement = _planningService.GetAcademicPlan(0, false, yearTermArray[0],
                        yearTermArray[1], program, degreeArray[0], degreeArray[1], AcademicPlanView.DetailedRequirements);
                    bool isAnonymous = Account == null;
                    showSequence = _institutionSettingService.GetStudentRecords().ShowSequence;

                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        degree,
                        showSequence,
                        studentDegreeRequirement = studentDegreeRequirement.ToViewModel(general),
                        isAnonymous
                    }));
                }
                return Json(SerializationHelper.ToJsonResult(null, "The year/term or the program value does not have a correct format.", 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DegreeRequirementsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}