// --------------------------------------------------------------------
// <copyright file="ProspectController.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Account;
using SelfService.Models.Session;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// ProspectController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class ProspectController : BaseEndpointController
    {
        /// <summary>
        /// The cart service
        /// </summary>
        private readonly ICartService _cartService;

        /// <summary>
        /// The code table service/
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<ProspectController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The person service
        /// </summary>
        private readonly IPersonService _personService;

        /// <summary>
        /// The registration service
        /// </summary>
        private readonly IRegistrationService _registrationService;

        /// <summary>
        /// The temporary user service
        /// </summary>
        private readonly ITemporaryUserService _temporaryUserService;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProspectController"/> class.
        /// </summary>
        /// <param name="cartService">The cart service.</param>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="personService">The person service.</param>
        /// <param name="registrationService">The registration service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="logger">The logger.</param>
        public ProspectController(
            ICartService cartService,
            ICodeTableService codeTableService,
            IInstitutionSettingService institutionSettingService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            IPersonService personService,
            IRegistrationService registrationService,
            ISerializationHelper serializationHelper,
            ITemporaryUserService temporaryUserService,
            IAppLogger<ProspectController> logger)
            : base(serializationHelper)
        {
            _cartService = cartService;
            _codeTableService = codeTableService;
            _institutionSettingService = institutionSettingService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _personService = personService;
            _registrationService = registrationService;
            _temporaryUserService = temporaryUserService;

            _logger = logger;
        }

        /// <summary>
        /// Get the coned data to create a prospect
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Prospect/ConEdData")]
        public JsonResult ConEdData()
        {
            try
            {
                List<ListOptionViewModel> addressTypeOptions = null;
                List<ListOptionViewModel> countryOptions = null;
                List<ListOptionViewModel> phoneTypeOptions = null;
                List<ListOptionViewModel> prefixOptions = null;
                List<ListOptionViewModel> stateOptions = null;
                List<ListOptionViewModel> suffixOptions = null;
                List<ProspectListItem> interests = null;
                List<ProspectListItem> sources = null;
                TemporaryUser temporaryUser = null;
                InstitutionSettings.General generalSettings = _institutionSettingService.GetGeneral();
                if (Account.TemporaryUserId > 0)
                {
                    addressTypeOptions = _codeTableService.GetByName(CodeTableName.AddressType, true).ToViewModel();
                    countryOptions = _codeTableService.GetByName(CodeTableName.Country, true).ToViewModel();
                    phoneTypeOptions = _codeTableService.GetPhoneTypes().ToViewModel(false);
                    prefixOptions = _codeTableService.GetByName(CodeTableName.Prefix, true).ToViewModel();
                    stateOptions = _codeTableService.GetByName(CodeTableName.State, true).ToViewModel();
                    suffixOptions = _codeTableService.GetByName(CodeTableName.Suffix, true).ToViewModel();
                    interests = _codeTableService.GetByName(CodeTableName.AcaInterest, true).ToListItemViewModel();
                    if (_institutionSettingService.GetConEdRegistration().IncludeUncategorizedSources)
                        sources = _codeTableService.GetConEdSourceList().ToListItemViewModel();
                    temporaryUser = _temporaryUserService.Get(Account.UserName);
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    addressTypeOptions,
                    countryOptions,
                    phoneTypeOptions,
                    prefixOptions,
                    stateOptions,
                    suffixOptions,
                    interests,
                    sources,
                    firstName = temporaryUser?.FirstName,
                    lastName = temporaryUser?.LastName,
                    generalSettings.GovernmentIdMaxLength,
                    generalSettings.GovernmentIdFormat
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ProspectController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Creates the con ed prospect.
        /// </summary>
        /// <param name="prospect">The prospect.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Prospect/CreateConEd")]
        public JsonResult CreateConEd([FromBody] ConEdProspectViewModel prospect)
        {
            try
            {
                bool result = false;
                if (Account.TemporaryUserId > 0 && prospect != null)
                {
                    TemporaryUser temporaryUser = _temporaryUserService.Get(Account.UserName);
                    prospect.Email = temporaryUser.Email;
                    prospect.EmailType = _institutionSettingService.GetConEdRegistration().DefaultEmailType;
                    int personId = _registrationService.CreateConEdProspect(prospect.ToDTO());
                    People people = null;
                    if (personId > 0)
                    {
                        _personService.CreatePersonUser(personId, temporaryUser.UserName, null);
                        people = _peopleService.Get(personId);
                        Account = new Account
                        {
                            DisplayName = people?.DisplayName ?? string.Empty,
                            Email = people?.Email ?? string.Empty,
                            PersonId = personId,
                            TemporaryUserId = -1,
                            UserName = temporaryUser.UserName
                        };
                        HttpContext.Session.SetObject(Constants._accountSession, Account);
                        // Merge cart from logged user to authenticated user
                        List<int> sectionToMerged = _temporaryUserService.GetSectionIds(temporaryUser.Id);
                        if (sectionToMerged?.Count > 0)
                        {
                            foreach (int sectionId in sectionToMerged)
                                _cartService.Create(Account.PersonId, sectionId);
                        }
                        _temporaryUserService.Delete(temporaryUser.Id);
                        result = true;
                        // Send notification
                        _ = SendCompleteProfileNotificationAsync();
                    }
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ProspectController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Sends the complete profile notification asynchronous.
        /// </summary>
        private async Task SendCompleteProfileNotificationAsync()
        {
            try
            {
                if (Account.PersonId > 0)
                {
                    const string eventNotification = NotificationEvent.ConEdProfileCreated;
                    bool isActive = await _notificationsHelper.EventIsActiveAsync(eventNotification).ConfigureAwait(false);
                    if (!isActive)
                        return;

                    List<NotificationToken> currentTokens = _notificationsHelper.GetPersonNotificationTokensByPersonId(_peopleService, Account.PersonId);
                    _notificationsHelper.Create(new NotificationEventModel
                    {
                        EventKey = eventNotification,
                        Tokens = currentTokens
                    });
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ProspectController).FullName, exception.Message, exception);
            }
        }
    }
}