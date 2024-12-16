// --------------------------------------------------------------------
// <copyright file="CampusCoordinatorsController.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Administration;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// CampusCoordinatorsController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class CampusCoordinatorsController : BaseEndpointController
    {
        /// <summary>
        /// The campus coordinator service
        /// </summary>
        private readonly ICampusCoordinatorService _campusCoordinatorService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<CampusCoordinatorsController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="CampusCoordinatorsController" /> class.
        /// </summary>
        /// <param name="campusCoordinatorService">The campus coordinator service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public CampusCoordinatorsController(
            ICampusCoordinatorService campusCoordinatorService,
            IInstitutionSettingService institutionSettingService,
            ISerializationHelper serializationHelper,
            IAppLogger<CampusCoordinatorsController> logger)
            : base(serializationHelper)
        {
            _campusCoordinatorService = campusCoordinatorService;
            _institutionSettingService = institutionSettingService;

            _logger = logger;
        }

        /// <summary>
        /// Deletes the specified campus coordinator.
        /// </summary>
        /// <param name="campusCoordinatorId">The campus coordinator identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CampusCoordinators/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationInstructorSetupCampusCoordinator
         }})]
        public JsonResult Delete([FromBody] int campusCoordinatorId)
        {
            try
            {
                bool result = _campusCoordinatorService.Delete(campusCoordinatorId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CampusCoordinatorsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Faculties the has campus.
        /// </summary>
        /// <param name="campusCoordinatorModel">The campus coordinator model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CampusCoordinators/FacultyHasCampus")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationInstructorSetupCampusCoordinator
         }})]
        public JsonResult FacultyHasCampus([FromBody] CampusCoordinatorModel campusCoordinatorModel)
        {
            try
            {
                bool hasCampus = _campusCoordinatorService.Exists(campusCoordinatorModel.OrganizationId, campusCoordinatorModel.PersonId);
                return Json(SerializationHelper.ToJsonResult(hasCampus));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CampusCoordinatorsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the campus coordinators.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("CampusCoordinators")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationInstructorSetupCampusCoordinator
         }})]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Index()
        {
            try
            {
                List<CampusCoordinatorDetail> campusCoordinatorDetails = _campusCoordinatorService.Get();
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(campusCoordinatorDetails.ToViewModel(CurrentNameFormat, CurrentNameSort, general.PeopleIdFormat, ShowMiddleNameInitial)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CampusCoordinatorsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified campus coordinators.
        /// </summary>
        /// <param name="campusCoordinators">The campus coordinators.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("CampusCoordinators/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationInstructorSetupCampusCoordinator
         }})]
        public JsonResult Save([FromBody] CampusCoordinator campusCoordinator)
        {
            try
            {
                bool result = false;
                if (campusCoordinator != null)
                    result = _campusCoordinatorService.Save(campusCoordinator);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CampusCoordinatorsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}