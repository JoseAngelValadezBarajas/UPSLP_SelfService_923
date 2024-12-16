// --------------------------------------------------------------------
// <copyright file="OrganizationsController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Mappers;
using SelfService.Models.Organization;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// OrganizationsController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    public class OrganizationsController : BaseEndpointController
    {
        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<OrganizationsController> _logger;

        /// <summary>
        /// The organization service
        /// </summary>
        private readonly IOrganizationService _organizationService;

        /// <summary>
        /// Initializes a new instance of the <see cref="OrganizationsController"/> class.
        /// </summary>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="organizationService">The organization service.</param>
        /// <param name="logger">The logger.</param>
        public OrganizationsController(
            ISerializationHelper serializationHelper,
            IOrganizationService organizationService,
            IAppLogger<OrganizationsController> logger)
            : base(serializationHelper)
        {
            _organizationService = organizationService;

            _logger = logger;
        }

        /// <summary>
        /// Indexes the specified form identifier.
        /// </summary>
        /// <param name="formId">The form identifier.</param>
        /// <param name="group">The group.</param>
        /// <param name="id">The identifier.</param>
        /// <param name="step">The step.</param>
        /// <param name="targetId">The target identifier.</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost]
        public JsonResult Buildings([FromBody] OrganizationBuildingModel organizationBuildingModel)
        {
            try
            {
                string group = organizationBuildingModel.Group;
                int id = organizationBuildingModel.Id;
                string step = organizationBuildingModel.Step;
                string targetId = organizationBuildingModel.TargetId;
                List<CodeTable> buildings = _organizationService.GetBuildingList(id);
                if (buildings != null)
                    return Json(SerializationHelper.ToJsonResult(new { results = buildings.ToViewModel(), step, group, targetId }));

                return Json(SerializationHelper.ToJsonResult(new { step, group, targetId }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ActivitiesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}