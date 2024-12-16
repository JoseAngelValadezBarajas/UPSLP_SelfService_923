// --------------------------------------------------------------------
// <copyright file="EmergencyContactsController.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Degrees route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class EmergencyContactsController : BaseEndpointController
    {
        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The institution Setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<EmergencyContactsController> _logger;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// Initializes a new instance of the <see cref="EmergencyContactsController"/> class.
        /// </summary>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public EmergencyContactsController(
            ICodeTableService codeTableService,
            IInstitutionSettingService institutionSettingService,
            IPeopleService peopleService,
            ISerializationHelper serializationHelper,
            IAppLogger<EmergencyContactsController> logger)
            : base(serializationHelper)
        {
            _codeTableService = codeTableService;
            _institutionSettingService = institutionSettingService;
            _peopleService = peopleService;

            _logger = logger;
        }

        /// <summary>
        /// Indexes this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("EmergencyContacts")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileEmergencyContacts } })]
        public JsonResult Index()
        {
            try
            {
                InstitutionSettings.EmergencyContacts settings = _institutionSettingService.GetEmergencyContacts();
                PeopleEmergencyDetail peopleEmergency = _peopleService.GetEmergencyContact(Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(new { peopleEmergency, settings }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(EmergencyContactsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Optionses this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("EmergencyContacts/Options")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileEmergencyContacts } })]
        public JsonResult Options()
        {
            try
            {
                List<ListOptionViewModel> countryOptions = _codeTableService.GetAllCountries().ToViewModel(true);
                List<ListOptionViewModel> relationTypeOptions = _codeTableService.GetByName(CodeTableName.RelationshipType).ToViewModel(false);
                return Json(SerializationHelper.ToJsonResult(new { countryOptions, relationTypeOptions }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(EmergencyContactsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the specified people emergency.
        /// </summary>
        /// <param name="peopleEmergency">The people emergency.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("EmergencyContacts/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.GeneralProfileEmergencyContacts } })]
        public JsonResult Save([FromBody] PeopleEmergency peopleEmergency)
        {
            try
            {
                bool result = false;
                InstitutionSettings.EmergencyContacts settings = _institutionSettingService.GetEmergencyContacts();
                if (settings.AllowEdit)
                {
                    if (string.IsNullOrEmpty(peopleEmergency.PeopleCodeId))
                        result = _peopleService.CreateEmergencyContact(Account.PersonId, peopleEmergency);
                    else
                        result = _peopleService.UpdateEmergencyContact(Account.PersonId, peopleEmergency);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(EmergencyContactsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}