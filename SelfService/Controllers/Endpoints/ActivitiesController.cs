// --------------------------------------------------------------------
// <copyright file="ActivityController.cs" company="Ellucian">
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
using SelfService.Models.Forms;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// ActivitiesController
    /// </summary>
    /// <seealso cref="SelfService.Controllers.Endpoints.BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class ActivitiesController : BaseEndpointController
    {
        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<ActivitiesController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="ActivitiesController" /> class.
        /// </summary>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public ActivitiesController(
            ICodeTableService codeTableService,
            ISerializationHelper serializationHelper,
            IAppLogger<ActivitiesController> logger)
            : base(serializationHelper)
        {
            _codeTableService = codeTableService;

            _logger = logger;
        }

        /// <summary>
        /// Indexes the specified activity model.
        /// </summary>
        /// <param name="activityModel">The activity model.</param>
        /// <returns></returns>
        [AllowAnonymous]
        [Route("Activities")]
        [HttpPost]
        public JsonResult Index([FromBody] ActivityModel activityModel)
        {
            try
            {
                int formId = activityModel.FormId;
                string group = activityModel.Group;
                int id = activityModel.Id;
                string step = activityModel.Step;
                string targetId = activityModel.TargetId;
                bool isApplicationForm = activityModel.IsApplicationForm;
                List<CodeTable> activities = new();
                if (isApplicationForm)
                    activities = _codeTableService.GetApplicationActivities(id, formId);
                else
                    activities = _codeTableService.GetInquiryActivities(formId, id);
                if (activities != null)
                    return Json(SerializationHelper.ToJsonResult(new { results = activities.ToViewModel(), step, group, targetId }));

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