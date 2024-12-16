// --------------------------------------------------------------------
// <copyright file="WaitListController.cs" company="Ellucian">
//     Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Models.Registration;
using System;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /WaitList route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class WaitListController : BaseEndpointController
    {
        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<WaitListController> _logger;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IWaitListService _waitListService;

        /// <summary>
        /// Initializes a new instance of the <see cref="WaitListController"/> class.
        /// </summary>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="waitListService">The wait list service.</param>
        /// <param name="logger">The logger.</param>
        public WaitListController(
            ISerializationHelper serializationHelper,
            IWaitListService waitListService,
            IAppLogger<WaitListController> logger)
            : base(serializationHelper)
        {
            _waitListService = waitListService;

            _logger = logger;
        }

        /// <summary>
        /// Creates the specified cart model.
        /// </summary>
        /// <param name="model">The cart model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Waitlist/Create")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult Create([FromBody] CartModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                int sectionId = model.Id;
                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                if (_waitListService.Create(personId, sectionId))
                    return Json(SerializationHelper.ToJsonResult(sectionId));
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(WaitListController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Deletes the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Waitlist/Delete")]
        public JsonResult Delete([FromBody] int id)
        {
            try
            {
                if (_waitListService.Delete(Account.PersonId, id))
                    return Json(SerializationHelper.ToJsonResult(id));
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(WaitListController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }
    }
}