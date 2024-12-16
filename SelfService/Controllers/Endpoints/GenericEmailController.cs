// --------------------------------------------------------------------
// <copyright file="GenericEmailController.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Notifications;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// GenericEmailController endpoint.
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class GenericEmailController : BaseEndpointController
    {
        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<GenericEmailController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="GenericEmailController"/> class.
        /// </summary>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public GenericEmailController(
            INotificationsHelper notificationsHelper,
            ISerializationHelper serializationHelper,
            IAppLogger<GenericEmailController> logger)
            : base(serializationHelper)
        {
            _notificationsHelper = notificationsHelper;

            _logger = logger;
        }

        /// <summary>
        /// Sends the specified generic email.
        /// </summary>
        /// <param name="genericEmail">The generic email.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GenericEmail/Send")]
        public async Task<JsonResult> Send([FromBody] GenericEmailModel genericEmail)
        {
            try
            {
                bool result = false;
                if (genericEmail != null)
                {
                    string eventNotification = string.Empty;
                    eventNotification = NotificationEvent.GenericEmail;
                    bool isActive = await _notificationsHelper.EventIsActiveAsync(eventNotification).ConfigureAwait(false);
                    if (!isActive)
                        return Json(SerializationHelper.ToJsonResult(result));

                    List<NotificationToken> currentTokens = new()
                    {
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = genericEmail.To } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "from", Value = genericEmail.From } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "message", Value = genericEmail.Message } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "subject", Value = genericEmail.Subject } },
                    };

                    _notificationsHelper.Create(new()
                    {
                        EventKey = eventNotification,
                        Tokens = currentTokens
                    });
                    result = true;
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(GenericEmailController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }
    }
}