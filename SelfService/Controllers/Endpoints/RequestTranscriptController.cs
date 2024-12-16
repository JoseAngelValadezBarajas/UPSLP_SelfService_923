// --------------------------------------------------------------------
// <copyright file="RequestTranscriptController.cs" company="Ellucian">
//     Copyright  2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

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
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /RequestTranscript route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class RequestTranscriptController : BaseEndpointController
    {
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
        private readonly IAppLogger<RequestTranscriptController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The period services
        /// </summary>
        private readonly IPeriodService _periodService;

        /// <summary>
        /// The transcript request service
        /// </summary>
        private readonly ITranscriptRequestService _transcriptRequestService;

        /// <summary>
        /// Initializes a new instance of the <see cref="RequestTranscriptController"/> class.
        /// </summary>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="periodService">The period service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="transcriptRequestService">The transcript request service.</param>
        /// <param name="logger">The logger.</param>
        public RequestTranscriptController(
            ICodeTableService codeTableService,
            IInstitutionSettingService institutionSettingService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            IPeriodService periodService,
            ISerializationHelper serializationHelper,
            ITranscriptRequestService transcriptRequestService,
            IAppLogger<RequestTranscriptController> logger)
            : base(serializationHelper)
        {
            _codeTableService = codeTableService;
            _institutionSettingService = institutionSettingService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _periodService = periodService;
            _transcriptRequestService = transcriptRequestService;

            _logger = logger;
        }

        /// <summary>
        /// Endpoint to create a request transcript.
        /// </summary>
        /// <param name="requestTranscripts">The request transcripts.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("RequestTranscript/Create")]
        public JsonResult Create([FromBody] List<TranscriptRequestRecipient> requestTranscripts)
        {
            try
            {
                InstitutionSettings.TranscriptRequest transcriptRequest = _institutionSettingService.GetTranscriptRequest();
                bool result = _transcriptRequestService.Create(requestTranscripts, transcriptRequest,
                    Account.PersonId);
                if (result)
                {
                    string academicYear = _periodService.GetCurrentYear();
                    string academicTerm = _periodService.GetCurrentTerm();
                    foreach (TranscriptRequestRecipient requestTranscriptRecipient in requestTranscripts)
                        _ = CreateTranscriptRequestNotification(requestTranscriptRecipient, academicYear, academicTerm);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RequestTranscriptController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Creates the transcript request notification.
        /// </summary>
        /// <param name="requestTranscript">The request transcript.</param>
        /// <param name="academicYear">The academic year.</param>
        /// <param name="academicTerm">The academic term.</param>
        /// <returns></returns>
        public async Task<JsonResult> CreateTranscriptRequestNotification(TranscriptRequestRecipient requestTranscript, string academicYear, string academicTerm)
        {
            try
            {
                bool notificationSend = true;
                if (await _notificationsHelper.EventIsActiveAsync(NotificationEvent.TranscriptRequestRequestSubmitted))
                {
                    List<NotificationToken> currentTokens = new();
                    People person = _peopleService.Get(Account.PersonId);
                    currentTokens = new List<NotificationToken>
                    {
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = person.Email } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.prefix", Value = person.Prefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.firstname", Value = person.FirstName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.middlename", Value = person.MiddleName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastname", Value = person.LastName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.suffix'", Value = person.Suffix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.nickname", Value = person.Nickname } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastnameprefix", Value = person.LastNamePrefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.legalname", Value = person.LegalName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "name.displayname", Value = person.DisplayName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.academicyear", Value =  academicYear } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.academicterm", Value =  academicTerm } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.date", Value = requestTranscript.Name } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.copiesrequested", Value = requestTranscript.NumberCopies.ToString() } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.recipient", Value = requestTranscript.Name } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.housenumber", Value = requestTranscript.HouseNumber } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.addressline1", Value = requestTranscript.AddressLine1 } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.addressline2", Value = requestTranscript.AddressLine2 } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.addressline3", Value = requestTranscript.AddressLine3 } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.addressline4", Value = requestTranscript.AddressLine4 } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.city", Value = requestTranscript.City } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.stateprovince", Value = requestTranscript.StateProvince.ToString() } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.postalcode", Value = requestTranscript.PostalCode } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.country", Value = requestTranscript.Country.ToString() } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "transcriptrequest.reason", Value = requestTranscript.RequestReason } }
                    };

                    _notificationsHelper.Create(new NotificationEventModel
                    {
                        EventKey = NotificationEvent.TranscriptRequestRequestSubmitted,
                        Tokens = currentTokens
                    });
                }
                else
                {
                    _logger.LogError(Constants._product, typeof(RequestTranscriptController).FullName, "Notification is not Active: " + NotificationEvent.TranscriptRequestRequestSubmitted);
                    notificationSend = false;
                }
                return Json(SerializationHelper.ToJsonResult(notificationSend));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RequestTranscriptController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Endpoint that retrieves first load information.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("RequestTranscript")]
        public JsonResult Index()
        {
            try
            {
                InstitutionSettings.TranscriptRequest transcriptRequest = _institutionSettingService.GetTranscriptRequest();
                bool enableOnlinePayment = transcriptRequest.EnableOnlinePayment;
                bool requireOnlinePayment = transcriptRequest.RequireOnlinePayment;
                bool requireConsent = transcriptRequest.RequireConsent;
                decimal feeAmount = transcriptRequest.FeeAmount;
                string disclosureStatement = transcriptRequest.DisclosureStatement;
                List<ListOptionViewModel> stateOptions = _codeTableService.GetByName(CodeTableName.State, true).ToViewModel();
                List<ListOptionViewModel> countryOptions = _codeTableService.GetByName(CodeTableName.Country, true).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    stateOptions,
                    countryOptions,
                    enableOnlinePayment,
                    requireOnlinePayment,
                    feeAmount,
                    requireConsent,
                    disclosureStatement
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(RequestTranscriptController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }
    }
}