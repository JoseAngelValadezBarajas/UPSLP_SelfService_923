// --------------------------------------------------------------------
// <copyright file="AssociationHeadController.cs" company="Ellucian">
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
    /// AssociationHeadController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class AssociationHeadController : BaseEndpointController
    {
        /// <summary>
        /// The association head service
        /// </summary>
        private readonly IAssociationHeadService _associationHeadService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<AssociationHeadController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="AssociationHeadController"/> class.
        /// </summary>
        /// <param name="associationHeadService">The association head service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public AssociationHeadController(
            IAssociationHeadService associationHeadService,
            IInstitutionSettingService institutionSettingService,
            ISerializationHelper serializationHelper,
            IAppLogger<AssociationHeadController> logger)
            : base(serializationHelper)
        {
            _associationHeadService = associationHeadService;
            _institutionSettingService = institutionSettingService;

            _logger = logger;
        }

        /// <summary>
        /// Deletes the specified association head identifier.
        /// </summary>
        /// <param name="associationHeadId">The association head identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("AssociationHead/Delete")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationInstructorSetupAssociationHead } })]
        public JsonResult Delete([FromBody] int associationHeadId)
        {
            try
            {
                bool result = _associationHeadService.Delete(associationHeadId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AssociationHeadController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Faculties the has association.
        /// </summary>
        /// <param name="associationHeadModel">The association head model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("AssociationHead/FacultyHasAssociation")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationInstructorSetupAssociationHead } })]
        public JsonResult FacultyHasAssociation([FromBody] AssociationHeadModel associationHeadModel)
        {
            try
            {
                bool hasAsssociation = _associationHeadService.Exists(associationHeadModel.AssociationId, associationHeadModel.PersonId);
                return Json(SerializationHelper.ToJsonResult(hasAsssociation));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AssociationHeadController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Returns all Association heads.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("AssociationHead")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationInstructorSetupAssociationHead } })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Index()
        {
            try
            {
                List<AssociationHeadDetail> associationHeadDetails = _associationHeadService.Get();
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(associationHeadDetails.ToViewModel(CurrentNameFormat, CurrentNameSort, general.PeopleIdFormat, ShowMiddleNameInitial)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AssociationHeadController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified association head.
        /// </summary>
        /// <param name="associationHead">The association head.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("AssociationHead/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationInstructorSetupAssociationHead } })]
        public JsonResult Save([FromBody] AssociationHead associationHead)
        {
            try
            {
                bool result = false;
                if (associationHead != null)
                    result = _associationHeadService.Save(associationHead);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(AssociationHeadController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}