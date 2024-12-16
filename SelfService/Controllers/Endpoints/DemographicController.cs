// --------------------------------------------------------------------
// <copyright file="DemographicController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Demographic route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class DemographicController : BaseEndpointController
    {
        /// <summary>
        /// The demographic request service
        /// </summary>
        private readonly IDemographicRequestService _demographicRequestService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<DemographicController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The picture helper
        /// </summary>
        private readonly IPictureHelper _pictureHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="DemographicController"/> class.
        /// </summary>
        /// <param name="demographicRequestService">The demographic request service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public DemographicController(
            IDemographicRequestService demographicRequestService,
            IInstitutionSettingService institutionSettingService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            IPictureHelper pictureHelper,
            ISerializationHelper serializationHelper,
            IAppLogger<DemographicController> logger)
            : base(serializationHelper)
        {
            _demographicRequestService = demographicRequestService;
            _institutionSettingService = institutionSettingService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _pictureHelper = pictureHelper;

            _logger = logger;
        }

        /// <summary>
        /// Approves the specified demographic form.
        /// </summary>
        /// <param name="demographicFormId">The demographic form identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Demographic/Requests/Approve")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationRequestsSetupDemographic } })]
        public JsonResult Approve([FromBody] int demographicFormId)
        {
            try
            {
                bool result = _demographicRequestService.Approve(demographicFormId, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DemographicController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Creates the demographic request notification.
        /// </summary>
        /// <param name="notificationRequest">The notification request.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Demographic/Requests/CreateNotification")]
        public async Task<JsonResult> CreateDemographicRequestNotification([FromBody] NotificationRequest notificationRequest)
        {
            try
            {
                bool notificationSend = true;
                bool notificationType = false;
                string notificationEventKey = string.Empty;
                int personId = Account.PersonId;
                switch (notificationRequest.Type)
                {
                    case 0:
                        notificationType = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.ProfileDemographicRequestApproved);
                        notificationEventKey = NotificationEvent.ProfileDemographicRequestApproved;
                        personId = notificationRequest.PersonId;
                        break;

                    case 1:
                        notificationType = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.ProfileDemographicRequestDenied);
                        notificationEventKey = NotificationEvent.ProfileDemographicRequestDenied;
                        personId = notificationRequest.PersonId;
                        break;

                    case 2:
                        notificationType = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.ProfileDemographicRequestSubmitted);
                        notificationEventKey = NotificationEvent.ProfileDemographicRequestSubmitted;
                        break;
                }

                if (notificationType)
                {
                    People person = _peopleService.Get(personId);
                    List<NotificationToken> currentTokens = new()
                    {
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = person.Email } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.prefix", Value = person.Prefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.firstname", Value = person.FirstName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.middlename", Value = person.MiddleName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastname", Value = person.LastName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.suffix", Value = person.Suffix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.nickname", Value = person.Nickname } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastnameprefix", Value = person.LastNamePrefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.legalname", Value = person.LegalName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.displayname", Value = person.DisplayName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "demographicrequest.decision", Value = notificationRequest.Decision } }
                    };

                    _notificationsHelper.Create(new NotificationEventModel
                    {
                        EventKey = notificationEventKey,
                        Tokens = currentTokens
                    });

                    return Json(SerializationHelper.ToJsonResult(notificationSend));
                }
                notificationSend = false;
                return Json(SerializationHelper.ToJsonResult(notificationSend));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DemographicController).FullName, exception.Message, exception);
                return await Task.FromResult(Json(SerializationHelper.ToJsonResult(null, null, 0, false)));
            }
        }

        /// <summary>
        /// Deletes the specified demographic form.
        /// </summary>
        /// <param name="demographicFormId">The demographic form identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Demographic/Requests/Delete")]
        public JsonResult Delete([FromBody] int demographicFormId)
        {
            try
            {
                bool result = false;
                if (demographicFormId > 0)
                    result = _demographicRequestService.Delete(demographicFormId);

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DemographicController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Denies the specified demographic form.
        /// </summary>
        /// <param name="demographicFormId">The demographic form identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Demographic/Requests/Deny")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationRequestsSetupDemographic } })]
        public JsonResult Deny([FromBody] int demographicFormId)
        {
            try
            {
                bool result = _demographicRequestService.Deny(demographicFormId, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DemographicController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        ///  Get the demographics requests.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Demographic")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationRequestsSetupDemographic } })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Index()
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<ProfileRequest> peopleDemographicRequests = _demographicRequestService.Get();
                return Json(SerializationHelper.ToJsonResult(peopleDemographicRequests
                    .ToViewModel(CurrentNameFormat, CurrentNameSort, _peopleService, general, ShowMiddleNameInitial, _pictureHelper)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DemographicController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}