// --------------------------------------------------------------------
// <copyright file="PreferredNamesController.cs" company="Ellucian">
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
    /// PreferredNamesController
    /// </summary>
    /// <seealso cref="SelfService.Controllers.Endpoints.BaseEndpointController" />
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class PreferredNamesController : BaseEndpointController
    {
        /// <summary>
        /// The gender identity request service
        /// </summary>
        private readonly IGenderIdentityRequestService _genderIdentityRequestService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<PreferredNamesController> _logger;

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
        /// Initializes a new instance of the <see cref="PreferredNamesController" /> class.
        /// </summary>
        /// <param name="genderIdentityRequestService">The gender identity request service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public PreferredNamesController(
            IGenderIdentityRequestService genderIdentityRequestService,
            IInstitutionSettingService institutionSettingService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            IPictureHelper pictureHelper,
            ISerializationHelper serializationHelper,
            IAppLogger<PreferredNamesController> logger)
            : base(serializationHelper)
        {
            _genderIdentityRequestService = genderIdentityRequestService;
            _institutionSettingService = institutionSettingService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _pictureHelper = pictureHelper;

            _logger = logger;
        }

        /// <summary>
        /// Approves the specified request identifier.
        /// </summary>
        /// <param name="requestId">The request identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("PreferredNames/Approve")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationRequestsSetupPreferredName } })]
        public JsonResult Approve([FromBody] int requestId)
        {
            try
            {
                bool result = _genderIdentityRequestService.Approve(requestId, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PreferredNamesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Cancels the specified request identifier.
        /// </summary>
        /// <param name="requestId">The request identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("PreferredNames/Cancel")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationProfileSetupPreferredName,
            ClaimsConstants.GeneralProfilePreferredName
         }, true })]
        public JsonResult Cancel([FromBody] int requestId)
        {
            try
            {
                bool result = _genderIdentityRequestService.Delete(requestId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PreferredNamesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Creates the preferred name notification.
        /// </summary>
        /// <param name="notificationRequest">The notification request.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("PreferredNames/CreatePreferredNameNotification")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationProfileSetupPreferredName,
            ClaimsConstants.AdministrationRequestsSetupPreferredName,
            ClaimsConstants.GeneralProfilePreferredName
         }, true })]
        public async Task<JsonResult> CreatePreferredNameNotification([FromBody] NotificationRequest notificationRequest)
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
                        notificationType = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.ProfilePreferredNameRequestApproved);
                        notificationEventKey = NotificationEvent.ProfilePreferredNameRequestApproved;
                        personId = notificationRequest.PersonId;
                        break;

                    case 1:
                        notificationType = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.ProfilePreferredNameRequestDenied);
                        notificationEventKey = NotificationEvent.ProfilePreferredNameRequestDenied;
                        personId = notificationRequest.PersonId;
                        break;

                    case 2:
                        notificationType = await _notificationsHelper.EventIsActiveAsync(NotificationEvent.ProfilePreferredNameRequestSubmitted);
                        notificationEventKey = NotificationEvent.ProfilePreferredNameRequestSubmitted;
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
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "preferrednamerequest.decision", Value = notificationRequest.Decision } }
                    };

                    _notificationsHelper.Create(new NotificationEventModel
                    {
                        EventKey = notificationEventKey,
                        Tokens = currentTokens
                    });

                    return Json(SerializationHelper.ToJsonResult(notificationSend));
                }
                else
                {
                    notificationSend = false;
                    return Json(SerializationHelper.ToJsonResult(notificationSend));
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PreferredNamesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Denies the specified request identifier.
        /// </summary>
        /// <param name="requestId">The request identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("PreferredNames/Deny")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationRequestsSetupPreferredName } })]
        public JsonResult Deny([FromBody] int requestId)
        {
            try
            {
                bool result = _genderIdentityRequestService.Deny(requestId, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PreferredNamesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the list of preferred names requests
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("PreferredNames")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationRequestsSetupPreferredName } })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Index()
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<ProfileRequest> preferredNameRequests = _genderIdentityRequestService.Get();
                return Json(SerializationHelper.ToJsonResult(preferredNameRequests.
                    ToViewModel(CurrentNameFormat, CurrentNameSort, _peopleService, general, ShowMiddleNameInitial, _pictureHelper)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DemographicController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}