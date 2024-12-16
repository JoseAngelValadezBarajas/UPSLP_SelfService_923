// --------------------------------------------------------------------
// <copyright file="InstitutionsController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Institutions;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Institutions route
    /// </summary>
    /// <seealso cref="SelfService.Controllers.Endpoints.BaseEndpointController" />
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class InstitutionsController : BaseEndpointController
    {
        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The institution service
        /// </summary>
        private readonly IInstitutionService _institutionService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<InstitutionsController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="InstitutionsController"/> class.
        /// </summary>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="institutionService">The institution service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public InstitutionsController(
           ICodeTableService codeTableService,
           IInstitutionService institutionService,
           ISerializationHelper serializationHelper,
           IAppLogger<InstitutionsController> logger)
           : base(serializationHelper)
        {
            _codeTableService = codeTableService;
            _institutionService = institutionService;

            _logger = logger;
        }

        /// <summary>
        /// Get Countries for Institutions Search
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Countries()
        {
            try
            {
                List<CodeTable> countries = _codeTableService.GetByName(CodeTableName.Country, true);
                return Json(SerializationHelper.ToJsonResult(countries.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InstitutionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Indexes the specified start index.
        /// </summary>
        /// <param name="startIndex">The start index.</param>
        /// <param name="length">The length.</param>
        /// <param name="institution">The institution.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Institutions")]
        [AllowAnonymous]
        public JsonResult Index([FromBody] InstitutionsModel institutionsModel)
        {
            try
            {
                int startIndex = institutionsModel.StartIndex.Value;
                int length = institutionsModel.Length.Value;
                Institution institution = institutionsModel.Institution;

                institution.Name = institution.Name == string.Empty ? null : institution.Name;
                institution.City = institution.City == string.Empty ? null : institution.City;
                institution.EtsCode = institution.EtsCode == string.Empty ? null : institution.EtsCode;

                List<Institution> institutions = null;
                if (startIndex >= 0 && length > 0 && institution != null)
                    institutions = _institutionService.Get(startIndex, length, institution);

                int overallCount = 0;
                if (institutions?.Count > 0)
                    overallCount = institutions[0].OverallCount;

                return Json(SerializationHelper.ToJsonResult(new { institutions, overallCount }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InstitutionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get States for Institutions Search
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult States()
        {
            try
            {
                List<CodeTable> states = _codeTableService.GetByName(CodeTableName.State, true);
                return Json(SerializationHelper.ToJsonResult(states.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InstitutionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}