// --------------------------------------------------------------------
// <copyright file="AcademicDefaultController.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using System;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /AcademicDefault route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class AcademicDefaultController : BaseEndpointController
    {
        /// <summary>
        /// The academic default service
        /// </summary>
        private readonly IAcademicDefaultService _academicDefaultService;

        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<AcademicDefaultController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="AcademicDefaultController"/> class.
        /// </summary>
        /// <param name="academicDefaultService">The academic default service.</param>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public AcademicDefaultController(
            IAcademicDefaultService academicDefaultService,
            ICodeTableService codeTableService,
            IInstitutionSettingService institutionSettingService,
            ISerializationHelper serializationHelper,
            IAppLogger<AcademicDefaultController> logger)
            : base(serializationHelper)
        {
            _academicDefaultService = academicDefaultService;
            _codeTableService = codeTableService;
            _institutionSettingService = institutionSettingService;

            _logger = logger;
        }

        /// <summary>
        /// Gets the academic default.
        /// </summary>
        /// <param name="registrationType">Type of the registration.</param>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupTraditionalDefaults, ClaimsConstants.AdministrationConEdSetupConEdDefaults }, true })]
        [Route("AcademicDefault/{registrationType}")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Index(RegistrationType registrationType)
        {
            try
            {
                string formatCredits = _institutionSettingService.GetGeneral().Credits;
                AcademicDefault academicDefault = _academicDefaultService.Get(registrationType);
                return Json(SerializationHelper.ToJsonResult(academicDefault.ToViewModel(formatCredits, _codeTableService, _academicDefaultService)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AcademicDefaultController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets the academic default.
        /// </summary>
        /// <param name="academicDefault">The academic default.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupTraditionalDefaults, ClaimsConstants.AdministrationConEdSetupConEdDefaults }, true })]
        [Route("AcademicDefault/Save")]
        public JsonResult Save([FromBody] AcademicDefault academicDefault)
        {
            try
            {
                bool IsSaved = _academicDefaultService.Update(academicDefault);
                if (IsSaved)
                    return Json(SerializationHelper.ToJsonResult(academicDefault));

                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AcademicDefaultController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }
    }
}