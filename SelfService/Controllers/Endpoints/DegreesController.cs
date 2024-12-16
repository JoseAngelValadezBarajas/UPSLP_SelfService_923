// --------------------------------------------------------------------
// <copyright file="DegreesController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
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
using SelfService.Models.DegreeRequirements;
using SelfService.Models.Degrees;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Degrees route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class DegreesController : BaseEndpointController
    {
        /// <summary>
        /// The degree service
        /// </summary>
        private readonly IDegreeService _degreeService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<DegreesController> _logger;

        /// <summary>
        /// The plan service
        /// </summary>
        private readonly IPlanningService _planningService;

        /// <summary>
        /// Initializes a new instance of the <see cref="DegreesController"/> class.
        /// </summary>
        /// <param name="degreeService">The degree service.</param>
        /// <param name="planningService">The planning service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public DegreesController(
            IDegreeService degreeService,
            IPlanningService planningService,
            ISerializationHelper serializationHelper,
            IAppLogger<DegreesController> logger)
            : base(serializationHelper)
        {
            _degreeService = degreeService;
            _planningService = planningService;

            _logger = logger;
        }

        /// <summary>
        /// Degrees the requirements.
        /// </summary>
        /// <param name="degreeRequirementModel">The degree requirement model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Degrees/DegreeRequirements")]
        [AllowAnonymous]
        public JsonResult DegreeRequirements([FromBody] DegreeRequirementModel degreeRequirementModel)
        {
            try
            {
                string yearTerm = degreeRequirementModel.YearTerm ?? string.Empty;
                string program = degreeRequirementModel.Program ?? string.Empty;
                if (string.IsNullOrEmpty(yearTerm.Trim()))
                    return Json(SerializationHelper.ToJsonResult(null, "The year/term is empty.", 0, false));
                if (string.IsNullOrEmpty(program.Trim()))
                    return Json(SerializationHelper.ToJsonResult(null, "The program is empty.", 0, false));
                string[] yearTermArray = yearTerm.Split('/');
                if (yearTermArray?.Length > 0)
                {
                    List<Degree> degrees = _planningService.GetDegrees(Account?.PersonId ?? 0, yearTermArray[0], yearTermArray[1], program, false);
                    List<ListOptionViewModel> options = degrees.ToViewModel();
                    return Json(SerializationHelper.ToJsonResult(options));
                }

                return Json(SerializationHelper.ToJsonResult(null, "The year/term value does not have a correct format.", 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DegreesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Whats if.
        /// </summary>
        /// <param name="degreeModel">The degree model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Degrees/WhatIf")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult WhatIf([FromBody] DegreeModel degreeModel)
        {
            try
            {
                int termPeriodId = degreeModel.TermPeriodId;
                string program = degreeModel.Program;
                if (termPeriodId <= 0)
                    return Json(SerializationHelper.ToJsonResult(new { termPeriodId }, string.Empty, 0, false));
                if (string.IsNullOrEmpty(program.Trim()))
                    return Json(SerializationHelper.ToJsonResult(null, "The program is empty.", 0, false));
                List<Degree> degrees = _degreeService.GetForWhatIf(degreeModel?.ImpersonateInfo?.PersonId ?? Account?.PersonId ?? 0, termPeriodId, program);
                List<ListOptionViewModel> options = degrees.ToViewModel();
                return Json(SerializationHelper.ToJsonResult(options));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DegreesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}