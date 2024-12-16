// --------------------------------------------------------------------
// <copyright file="TestScoresController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.TestScores;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /TestScores route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class TestScoresController : BaseEndpointController
    {
        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<TestScoresController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="TestScoresController"/> class.
        /// </summary>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public TestScoresController(
            ICodeTableService codeTableService,
            ISerializationHelper serializationHelper,
            IAppLogger<TestScoresController> logger)
            : base(serializationHelper)
        {
            _codeTableService = codeTableService;

            _logger = logger;
        }

        /// <summary>
        /// Scores the type.
        /// </summary>
        /// <param name="formId">The form identifier.</param>
        /// <param name="testId">The test identifier.</param>
        /// <param name="group">The group.</param>
        /// <param name="componentId">The component identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("TestScores/ScoreType")]
        public JsonResult ScoreType([FromBody] TestScoresModel testScoresModel)
        {
            try
            {
                int formId = testScoresModel.FormId;
                int testId = testScoresModel.TestId;
                string group = testScoresModel.Group;
                string componentId = testScoresModel.ComponentId;
                bool isNumeric = _codeTableService.IsScoreNumeric(formId, testId);
                return Json(SerializationHelper.ToJsonResult(new { isNumeric, group, componentId }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TestScoresController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Typeses the specified identifier.
        /// </summary>
        /// <param name="id">The Test identifier.</param>
        /// <param name="step">The step.</param>
        /// <param name="group">The group.</param>
        /// <param name="targetId">The target identifier.</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost]
        public JsonResult Types([FromBody] TestScoresTypeModel testScoresTypeModel)
        {
            try
            {
                List<CodeTable> testScoresTypes = _codeTableService.GetTestTypes(testScoresTypeModel.Id);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    results = testScoresTypes.ToViewModel(true),
                    testScoresTypeModel.Step,
                    testScoresTypeModel.Group,
                    testScoresTypeModel.TargetId
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TestScoresController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}