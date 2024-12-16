// --------------------------------------------------------------------
// <copyright file="NotificationsController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Enum;
using SelfService.Models.Notifications;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// NotificationsController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class NotificationsController : BaseEndpointController
    {
        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<NotificationsController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="NotificationsController"/> class.
        /// </summary>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingHelper">The setting helper.</param>
        /// <param name="logger">The logger.</param>
        public NotificationsController(
            INotificationsHelper notificationsHelper,
            IResourcesHelper resourcesHelper,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            IAppLogger<NotificationsController> logger)
            : base(serializationHelper)
        {
            _notificationsHelper = notificationsHelper;
            _resourcesHelper = resourcesHelper;
            _settingHelper = settingHelper;

            _logger = logger;
        }

        #region Notification Applications

        /// <summary>
        /// Get the Notification Applications
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Notifications/Applications")]
        public JsonResult Applications()
        {
            try
            {
                List<ListOptionViewModel> notificationApplications = new()
                {
                    new ListOptionViewModel { Value = NotificationApplication.SelfService },
                    new ListOptionViewModel { Value = NotificationApplication.UserManagement }
                };
                return Json(SerializationHelper.ToJsonResult(new { notificationApplications }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NotificationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult("Notification Applications Get Failure", null, 500, false));
            }
        }

        #endregion Notification Applications

        #region Notification Events

        /// <summary>
        /// Get the Event details by Event Code
        /// </summary>
        /// <param name="eventId">The event code.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Notifications/Events/Details")]
        public async Task<JsonResult> EventDetails([FromBody] int eventId)
        {
            try
            {
                if (eventId <= 0)
                    return Json(SerializationHelper.ToJsonResult("eventCode not valid " + eventId.ToString(), null, 500, false));
                string language = _settingHelper.GetLanguage(Account);
                return Json(SerializationHelper.ToJsonResult((await _notificationsHelper.GetEventAsync(eventId)).ToViewModel(_resourcesHelper, language)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NotificationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult("Notification Event Details Failure", null, 500, false));
            }
        }

        /// <summary>
        /// Get Notification Events
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Notifications/Events")]
        public async Task<JsonResult> Events([FromBody] int applicationId)
        {
            try
            {
                if (applicationId >= 0)
                {
                    string language = _settingHelper.GetLanguage(Account);
                    return Json(SerializationHelper.ToJsonResult((await _notificationsHelper.GetEventsAsync((NotificationApplication)applicationId))
                        .ToViewModel(_resourcesHelper, language)));
                }
                return Json(SerializationHelper.ToJsonResult("Invalid Notification Application", null, 500, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NotificationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult("Notification Events Failure", null, 500, false));
            }
        }

        /// <summary>
        /// Updates the specified notification to active/inactive
        /// </summary>
        /// <param name="isActive">if set to <c>true</c> [is active].</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Notifications/Events/Update")]
        public async Task<JsonResult> UpdateEvent([FromBody] NotificationEventUpdate notificationEventUpdate)
        {
            try
            {
                bool result = false;
                if (notificationEventUpdate != null)
                    result = await _notificationsHelper.UpdateEventAsync(notificationEventUpdate);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NotificationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult("UpdateEvent Failure", null, 500, false));
            }
        }

        #endregion Notification Events

        #region Notification Types

        /// <summary>
        /// Get Notification Types.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Notifications/Types")]
        public async Task<JsonResult> Types()
        {
            try
            {
                List<NotificationTypeViewModel> notificationTypesDetails = (await _notificationsHelper.GetTypesAsync()).ToViewModel();
                List<ListOptionViewModel> notificationTypes = new();
                foreach (NotificationTypeViewModel notificationType in notificationTypesDetails)
                    notificationTypes.Add(new ListOptionViewModel { Value = notificationType.TypeId });
                return Json(SerializationHelper.ToJsonResult(new
                {
                    notificationTypes,
                    notificationTypesDetails
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NotificationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult("Notification Types Failure", null, 500, false));
            }
        }

        #endregion Notification Types

        #region Notification Event Setup

        /// <summary>
        /// Creates the event setup.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Notifications/Events/Setup/Create")]
        public async Task<JsonResult> CreateEventSetup([FromBody] NotificationSetupViewModel notificationSetupViewModel)
        {
            try
            {
                bool resultStatus = await _notificationsHelper.CreateEventSetupAsync(notificationSetupViewModel);
                return Json(SerializationHelper.ToJsonResult(resultStatus));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NotificationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult("Notification Event Setup Failure", null, 500, false));
            }
        }

        /// <summary>
        /// Gets the event setup.
        /// </summary>
        /// <param name="eventId">The event identifier.</param>
        /// <param name="typeId">The type identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Notifications/Events/Setup")]
        public async Task<JsonResult> GetEventSetup([FromBody] NotificationModel notificationModel)
        {
            try
            {
                NotificationSetupModel notificationSetupModel = await _notificationsHelper.GetEventSetupAsync(notificationModel.EventId, notificationModel.TypeId);
                return Json(SerializationHelper.ToJsonResult(notificationSetupModel.ToViewModel()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(NotificationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult("Notification Event Setup Get Failure", null, 500, false));
            }
        }

        #endregion Notification Event Setup
    }
}