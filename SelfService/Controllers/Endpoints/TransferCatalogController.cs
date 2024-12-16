// --------------------------------------------------------------------
// <copyright file="TransferCatalogController.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Models.Course;
using SelfService.Models.Organization;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /TransferCatalog route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class TransferCatalogController : BaseEndpointController
    {
        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<TransferCatalogController> _logger;

        /// <summary>
        /// The transfer catalog service
        /// </summary>
        private readonly ITransferCatalogService _transferCatalogService;

        /// <summary>
        /// Initializes a new instance of the <see cref="TransferCatalogController"/> class.
        /// </summary>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="transferCatalogService">The transfer catalog service.</param>
        /// <param name="logger">The logger.</param>
        public TransferCatalogController(
            ISerializationHelper serializationHelper,
            ITransferCatalogService transferCatalogService,
            IAppLogger<TransferCatalogController> logger)
            : base(serializationHelper)
        {
            _transferCatalogService = transferCatalogService;

            _logger = logger;
        }

        /// <summary>
        /// Catalogs the course list.
        /// </summary>
        /// <param name="catalogCourseModel">The catalog course model.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public JsonResult CatalogCourseList([FromBody] CatalogCourseModel catalogCourseModel)
        {
            try
            {
                int organizationId = catalogCourseModel.OrganizationId;
                string transferEvent = catalogCourseModel.TransferEvent;
                int startIndex = catalogCourseModel.StartIndex ?? 0;
                int length = catalogCourseModel.Length ?? 0;
                List<TransferCourseEvent> transferCourseEvents = _transferCatalogService.GetCourseList(organizationId, transferEvent, startIndex, length);
                int total = 0;
                if (transferCourseEvents.Count > 0)
                    total = transferCourseEvents[0].OverallCount;
                return Json(SerializationHelper.ToJsonResult(new { transferCourseEvents, total }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TransferCatalogController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Organizations the list.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="length">The length.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public JsonResult OrganizationList([FromBody] OrganizationModel courseOrganizationModel)
        {
            try
            {
                string name = courseOrganizationModel.Name;
                int startIndex = courseOrganizationModel.StartIndex ?? 0;
                int length = courseOrganizationModel.Length ?? 0;
                List<Organization> organizations = _transferCatalogService.GetOrganizationList(name, startIndex, length);
                int total = 0;
                if (organizations.Count > 0)
                    total = organizations[0].OverallCount;
                return Json(SerializationHelper.ToJsonResult(new { organizations, total }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(TransferCatalogController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }
    }
}