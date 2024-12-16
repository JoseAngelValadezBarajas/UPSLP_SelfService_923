// --------------------------------------------------------------------
// <copyright file="InquiriesController.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Recruitment;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Core.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// InquiriesController
    /// </summary>
    /// <seealso cref="SelfService.Controllers.Endpoints.BaseEndpointController" />
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class InquiriesController : BaseEndpointController
    {
        /// <summary>
        /// The inquiry service
        /// </summary>
        private readonly IInquiryService _inquiryService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<InquiriesController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The temporary user service
        /// </summary>
        private readonly ITemporaryUserService _temporaryUserService;

        /// <summary>
        /// Initializes a new instance of the <see cref="InquiriesController"/> class.
        /// </summary>
        /// <param name="inquiryService">The inquiry service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="logger">The logger.</param>
        public InquiriesController(
            IInquiryService inquiryService,
            IInstitutionSettingService institutionSettingService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            ISerializationHelper serializationHelper,
            ITemporaryUserService temporaryUserService,
            IAppLogger<InquiriesController> logger)
            : base(serializationHelper)
        {
            _inquiryService = inquiryService;
            _institutionSettingService = institutionSettingService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _temporaryUserService = temporaryUserService;

            _logger = logger;
        }

        /// <summary>
        /// Creates the specified inquiry.
        /// </summary>
        /// <param name="inquiry">The inquiry.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Inquiries/Create")]
        public JsonResult Create([FromBody] Inquiry inquiry)
        {
            try
            {
                bool result = false;
                if (inquiry == null)
                    return Json(SerializationHelper.ToJsonResult("Invalid inquiry", null, 0, true));
                bool isAnonymous = Account == null;
                if (isAnonymous)
                    inquiry.PersonId = 0;
                else
                    inquiry.PersonId = Account.PersonId;
                if (ValidateMinimumRequiredFields(inquiry) && _inquiryService.IsValid(inquiry))
                    result = _inquiryService.Create(inquiry);

                if (result)
                {
                    string email = string.Empty;
                    if (Account != null)
                    {
                        if (Account.PersonId > 0 && Account.Email != null && !Account.Email.Equals(string.Empty))
                            email = Account.Email;
                        else if (inquiry.Email != null && !Account.Email.Equals(string.Empty) && inquiry.Email != null && !inquiry.Email.Equals(string.Empty))
                            email = inquiry.Email;
                        else if (Account.TemporaryUserId > 0 && Account.TemporaryEmail != null && !Account.TemporaryEmail.Equals(string.Empty))
                            email = Account.TemporaryEmail;
                        else if (Account == null && inquiry.Email != null && !inquiry.Email.Equals(string.Empty))
                            email = inquiry.Email;
                    }
                    else
                    {
                        email = inquiry.Email;
                    }
                    if (!string.IsNullOrEmpty(email))
                        _ = CreateInquiryNotification(email, string.Empty, inquiry);
                }

                return Json(SerializationHelper.ToJsonResult(new
                {
                    result
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InquiriesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Creates the inquiry notification.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <param name="formInquiryName">Name of the form inquiry.</param>
        /// <param name="inquiry">The inquiry.</param>
        /// <returns></returns>
        public async Task<JsonResult> CreateInquiryNotification(string email, string formInquiryName, Inquiry inquiry)
        {
            try
            {
                bool notificationSend = true;
                if (await _notificationsHelper.EventIsActiveAsync(NotificationEvent.AdmissionsInquirySubmitted))
                {
                    List<NotificationToken> currentTokens = new();
                    if (Account?.PersonId > 0)
                    {
                        People person = _peopleService.Get(Account.PersonId);
                        currentTokens = new List<NotificationToken>
                        {
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = email } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.prefix", Value = person.Prefix } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.firstname", Value = person.FirstName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.middlename", Value = person.MiddleName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.lastname", Value = person.LastName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.suffix", Value = person.Suffix } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.nickname", Value = person.Nickname } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.lastnameprefix", Value = person.LastNamePrefix } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.legalname", Value = person.LegalName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "formname", Value = formInquiryName } },
                        };
                    }
                    else if (Account?.TemporaryUserId > 0)
                    {
                        TemporaryUser person = _temporaryUserService.Get(email);
                        currentTokens = new List<NotificationToken>
                        {
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = email } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.firstname", Value = person.FirstName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.lastname", Value = person.LastName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "formname", Value = formInquiryName } },
                        };
                    }
                    else if (Account == null)
                    {
                        currentTokens = new List<NotificationToken>
                        {
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = email } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.prefix", Value = string.Empty } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.firstname", Value = inquiry.FirstName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.lastname", Value = inquiry.LastName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.middlename", Value = inquiry.MiddleName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.lastname", Value = inquiry.LastName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.suffix", Value = string.Empty} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.nickname", Value = inquiry.Nickname } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.lastnameprefix", Value = inquiry.LastNamePrefix } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "inquiryname.legalname", Value = string.Empty } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "formname", Value = formInquiryName } },
                        };
                    }
                    _notificationsHelper.Create(new NotificationEventModel
                    {
                        EventKey = NotificationEvent.AdmissionsInquirySubmitted,
                        Tokens = currentTokens
                    });
                }
                else
                {
                    _logger.LogError(Constants._product, typeof(InquiriesController).FullName, "Notification is not Active: " + NotificationEvent.AdmissionsInquirySubmitted);
                    notificationSend = false;
                }
                return Json(SerializationHelper.ToJsonResult(notificationSend));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InquiriesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the ReCaptcha settings for inquiry submission.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Inquiries/RecaptchaSettings")]
        public JsonResult GetRecaptchaSettings()
        {
            try
            {
                bool isReCaptchaSubmitInquiryEnabled = false;
                string reCaptchaSiteKey = string.Empty;

                InstitutionSettings.ReCaptcha reCaptchaSettings = _institutionSettingService.GetReCaptcha();
                isReCaptchaSubmitInquiryEnabled = reCaptchaSettings.EnableSubmitInquiry;
                reCaptchaSiteKey = reCaptchaSettings.SiteKey;

                return Json(SerializationHelper.ToJsonResult(new
                {
                    isReCaptchaSubmitInquiryEnabled,
                    reCaptchaSiteKey
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(InquiriesController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #region Private Methods

        /// <summary>
        /// Validates the minimum required fields.
        /// </summary>
        /// <param name="inquiry">The inquiry.</param>
        /// <returns></returns>
        private bool ValidateMinimumRequiredFields(Inquiry inquiry)
        {
            bool isValid = true;
            StringBuilder messages = new();
            messages.Append("Required Fields for Inquiry are missing: ");

            if (inquiry != null)
            {
                if (string.IsNullOrEmpty(inquiry.FirstName))
                {
                    isValid = false;
                    messages.Append("FirstName,");
                }
                if (string.IsNullOrEmpty(inquiry.LastName))
                {
                    isValid = false;
                    messages.Append("LastName,");
                }
                if (inquiry.Addresses == null)
                {
                    isValid = false;
                    messages.Append("Address,");
                }
                else
                {
                    foreach (FormAddress applicationAddress in inquiry.Addresses)
                    {
                        if (applicationAddress.Type == 0)
                        {
                            isValid = false;
                            messages.Append("Address.Type,");
                        }
                        if (string.IsNullOrEmpty(applicationAddress.Line1))
                        {
                            isValid = false;
                            messages.Append("Address.Line1,");
                        }
                        if (string.IsNullOrEmpty(applicationAddress.City))
                        {
                            isValid = false;
                            messages.Append("Address.City,");
                        }
                        if (applicationAddress.Country == 0)
                        {
                            isValid = false;
                            messages.Append("Address.Country,");
                        }
                        if (!isValid)
                            break;
                    }
                }
            }
            if (!isValid)
                _logger.LogError(Constants._product, typeof(InquiriesController).FullName, messages.ToString().Remove(messages.Length - 1, 1));

            return isValid;
        }

        #endregion Private Methods
    }
}