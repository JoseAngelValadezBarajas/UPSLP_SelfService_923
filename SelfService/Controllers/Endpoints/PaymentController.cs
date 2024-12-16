// --------------------------------------------------------------------
// <copyright file="PaymentController.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Advancement;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Recruitment;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Payment;
using SelfService.Models.Schedule;
using SelfService.Models.Session;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Openpay;
using Openpay.Entities;
using Openpay.Entities.Request;
using DocumentFormat.OpenXml.Drawing.Charts;
using SelfService.Data;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Anonymous Controller with endpoints for /Payment route
    /// </summary>
    /// <seealso cref="SelfService.Controllers.Endpoints.BaseEndpointController" />
    /// <seealso cref="BaseEndpointController" />
    [AllowAnonymous]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class PaymentController : BaseEndpointController
    {
        /// <summary>
        /// The application service
        /// </summary>
        private readonly IApplicationService _applicationService;

        /// <summary>
        /// The donation service
        /// </summary>
        private readonly IDonationService _donationService;

        /// <summary>
        /// The form service
        /// </summary>
        private readonly IFormService _formService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<PaymentController> _logger;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The payment service
        /// </summary>
        private readonly IPaymentService _paymentService;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The period service
        /// </summary>
        private readonly IPeriodService _periodService;

        /// <summary>
        /// The registration group service
        /// </summary>
        private readonly IRegistrationGroupService _registrationGroupService;

        /// <summary>
        /// The temporary user service
        /// </summary>
        private readonly ITemporaryUserService _temporaryUserService;

        /// <summary>
        /// The transcript request service
        /// </summary>
        private readonly ITranscriptRequestService _transcriptRequestService;

        /// <summary>
        /// Initializes a new instance of the <see cref="PaymentController"/> class.
        /// </summary>
        /// <param name="applicationService">The application service.</param>
        /// <param name="donationService">The donation service.</param>
        /// <param name="formService">The form service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="paymentService">The payment service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="periodService">The period service.</param>
        /// <param name="registrationGroupService">The registration group service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="transcriptRequestService">The transcript request service.</param>
        /// <param name="logger">The logger.</param>
        public PaymentController(
            IApplicationService applicationService,
            IDonationService donationService,
            IFormService formService,
            IInstitutionSettingService institutionSettingService,
            INotificationsHelper notificationsHelper,
            IPaymentService paymentService,
            IPeopleService peopleService,
            IPeriodService periodService,
            IRegistrationGroupService registrationGroupService,
            ISerializationHelper serializationHelper,
            ITemporaryUserService temporaryUserService,
            ITranscriptRequestService transcriptRequestService,
            IAppLogger<PaymentController> logger)
            : base(serializationHelper)
        {
            _applicationService = applicationService;
            _donationService = donationService;
            _formService = formService;
            _institutionSettingService = institutionSettingService;
            _notificationsHelper = notificationsHelper;
            _paymentService = paymentService;
            _peopleService = peopleService;
            _periodService = periodService;
            _registrationGroupService = registrationGroupService;
            _temporaryUserService = temporaryUserService;
            _transcriptRequestService = transcriptRequestService;

            _logger = logger;
        }

        /// <summary>
        /// Unsuccessfuls the specified transaction identifier.
        /// Payment vendor calls this action to indicate transaction failed
        /// </summary>
        /// <param name="transactionId">The transaction identifier.</param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Fail(int transactionId)
        {
            try
            {
                People person = null;
                if (TempData[Constants._applicationInfoTempData] != null)
                {
                    dynamic applicationInfo = SerializationHelper.ToObject<object>((string)TempData[Constants._applicationInfoTempData]);

                    person = new()
                    {
                        Prefix = applicationInfo.prefix,
                        FirstName = applicationInfo.firstName,
                        MiddleName = applicationInfo.middleName,
                        LastName = applicationInfo.lastName,
                        Nickname = applicationInfo.nickname,
                        LastNamePrefix = applicationInfo.lastNamePrefix,
                        LegalName = applicationInfo.legalName,
                        Suffix = applicationInfo.suffix,
                        Email = applicationInfo.email
                    };
                    TempData.Remove(Constants._applicationInfoTempData);
                }

                return GetPaymentTransaction(transactionId, false, person);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PaymentController).FullName, exception.Message, exception);
                return RedirectToAction("Index", "Home");
            }
        }

        /// <summary>
        /// Processes the specified payment request.
        /// </summary>
        /// <param name="paymentRequest">The payment request.</param>
        /// <param name="requestTranscripts">The request transcripts.</param>
        /// <param name="giftCampaigns">The gift campaigns.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Payment/Process")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Process([FromBody] PaymentModel paymentModel)
        {
            try
            {
                if (paymentModel == null)
                    return Json(SerializationHelper.ToJsonResult(null, null, 0, true));

                PaymentRequestModel paymentRequest = paymentModel.PaymentRequest;
                List<TranscriptRequestRecipient> requestTranscripts = paymentModel.RequestTranscripts;
                List<GiftCampaign> giftCampaigns = paymentModel.GiftCampaigns;
                int transactionId = 0;
                InstitutionSettings.Payment settingsPayment = _institutionSettingService.GetPayment();
                PaymentTransaction paymentTransaction = null;
                bool enableOnlinePayment = false;
                int? cashReceiptOffice = null;
                int? cashReceiptCode = null;
                int? chargeCreditCode = null;
                string baseUrl = string.Empty;
                string url = string.Empty;
                string paymentDescription = string.Empty;
                int? termPeriodId = null;
                int? sessionPeriodId = null;
                InstitutionSettings.Donation donation = null;
                switch (paymentRequest.PaymentOrigin)
                {
                    case PaymentOrigin.Registration:
                        InstitutionSettings.Registration settingsRegistration = _institutionSettingService.GetRegistration();
                        enableOnlinePayment = settingsRegistration.EnableOnlinePayment;
                        cashReceiptOffice = settingsRegistration.CashReceiptOffice;
                        cashReceiptCode = settingsRegistration.CashReceiptCode;
                        baseUrl = settingsPayment.Registration;
                        paymentDescription = "Traditional Registration Payment";
                        termPeriodId = _periodService.GetTermPeriodId(paymentRequest.YearTerm.Year, paymentRequest.YearTerm.Term);
                        break;

                    case PaymentOrigin.MakePayment:
                        InstitutionSettings.Financial settingsFinancial = _institutionSettingService.GetFinancial();
                        enableOnlinePayment = settingsFinancial.EnableOnlinePayment;
                        cashReceiptOffice = settingsFinancial.CashReceiptOffice;
                        cashReceiptCode = settingsFinancial.CashReceiptCode;
                        baseUrl = settingsPayment.Balance;
                        termPeriodId = paymentRequest.PaymentPeriod.TermPeriodId;
                        sessionPeriodId = paymentRequest.PaymentPeriod.SessionPeriodId;
                        paymentDescription = "Make Payment";
                        break;

                    case PaymentOrigin.Application:
                        ApplicationPaymentSettings applicationPayment =
                            _formService.GetApplicationPaymentSettings((int)paymentRequest.ApplicationId);
                        enableOnlinePayment = applicationPayment.EnableOnlinePayment;
                        cashReceiptOffice = null;
                        cashReceiptCode = null;
                        baseUrl = settingsPayment.Application;
                        termPeriodId = null;
                        paymentDescription = "Make Payment for Application";
                        HttpContext.Session.SetObject(Constants._paymentReturnUrlSession, paymentRequest.ReturnUrl);
                        string[] baseAppUrl = paymentRequest.ReturnUrl.Split('/');
                        HttpContext.Session.SetObject(Constants._applicationFormSettingIdSession, int.Parse(baseAppUrl[baseAppUrl.Length - 1]));
                        break;

                    case PaymentOrigin.ConEdRegistration:
                        InstitutionSettings.ConEdRegistration settingsConEdRegistration = _institutionSettingService.GetConEdRegistration();
                        enableOnlinePayment = settingsConEdRegistration.EnableOnlinePayment;
                        cashReceiptOffice = settingsConEdRegistration.CashReceiptOffice;
                        cashReceiptCode = settingsConEdRegistration.CashReceiptCode;
                        termPeriodId = _periodService.GetTermPeriodId(Convert.ToInt32(_periodService.GetCurrentYear()), _periodService.GetCurrentTerm());
                        baseUrl = settingsPayment.ConEdRegistration;
                        paymentDescription = "ConEd Registration Payment";
                        break;
                    //case PaymentOrigin.SharedAccessMakePayment:
                    //    baseUrl = settingsPayment.Balance;
                    //    paymentDescription = "Shared Access Payment";
                    //    break;
                    //case PaymentOrigin.OnlineDonation:
                    //    baseUrl = settingsPayment.Balance;
                    //    paymentDescription = "Online Donation";
                    //    break;
                    case PaymentOrigin.TranscriptRequest:
                        InstitutionSettings.TranscriptRequest transcriptRequest = _institutionSettingService.GetTranscriptRequest();
                        enableOnlinePayment = transcriptRequest.EnableOnlinePayment;
                        cashReceiptOffice = transcriptRequest.CashReceiptOffice;
                        cashReceiptCode = transcriptRequest.CashReceiptCode;
                        chargeCreditCode = transcriptRequest.ChargeCreditCode;
                        baseUrl = settingsPayment.TranscriptRequest;
                        termPeriodId = _periodService.GetCurrent().TermPeriodId;
                        paymentDescription = "Transcript Request";
                        break;

                    case PaymentOrigin.OnlineDonation:
                        donation = _institutionSettingService.GetDonation();
                        enableOnlinePayment = true;
                        cashReceiptOffice = donation.Office;
                        cashReceiptCode = null;
                        chargeCreditCode = null;
                        baseUrl = settingsPayment.Donations;
                        termPeriodId = null;
                        paymentDescription = "Make a gift";
                        break;
                }

                if (enableOnlinePayment
                    && !string.IsNullOrEmpty(baseUrl)
                    && (paymentRequest.PaymentOrigin == PaymentOrigin.Application
                    || paymentRequest.PaymentOrigin == PaymentOrigin.TranscriptRequest
                    || paymentRequest.PaymentOrigin == PaymentOrigin.OnlineDonation
                    || (cashReceiptOffice.HasValue
                        && cashReceiptCode.HasValue
                        && cashReceiptOffice.Value > 0
                        && cashReceiptCode.Value > 0
                        && (termPeriodId != null
                            || sessionPeriodId != null
                            || paymentRequest.PaymentOrigin == PaymentOrigin.ConEdRegistration))))
                {
                    paymentTransaction = new PaymentTransaction
                    {
                        PersonId = paymentRequest?.PersonId ?? (Account?.PersonId != null && Account.PersonId > -1 ?
                            Account?.PersonId : null),
                        PaymentOrigin = paymentRequest.PaymentOrigin,
                        Amount = paymentRequest.Amount,
                        CashReceiptCodeId = cashReceiptCode,
                        CashReceiptOfficeId = cashReceiptOffice,
                        ChargeCreditCodeId = chargeCreditCode,
                        Description = paymentDescription,
                        SessionPeriodId = sessionPeriodId,
                        TermPeriodId = termPeriodId,
                    };

                    transactionId = _paymentService.CreateTransaction(paymentTransaction);
                    if (paymentRequest.PaymentOrigin == PaymentOrigin.Application)
                        _applicationService.UpdatePaymentTransaction((int)paymentRequest.ApplicationId, transactionId);
                    if (paymentRequest.PaymentOrigin == PaymentOrigin.TranscriptRequest)
                        _transcriptRequestService.ProcessPayment(requestTranscripts, _institutionSettingService.GetTranscriptRequest(), Account.PersonId, transactionId);
                    if (paymentRequest.PaymentOrigin == PaymentOrigin.ConEdRegistration)
                        _registrationGroupService.UpdateTransactionPaymentTransId((int)paymentRequest.ConEdTransactionId, transactionId);
                    if (paymentRequest.PaymentOrigin == PaymentOrigin.OnlineDonation)
                    {
                        int giftBatchHeaderId = _donationService.GetCurrentGiftBatchHeader(donation);
                        if (giftBatchHeaderId > 0)
                        {
                            bool result = _donationService.CreateGiftCampaign(transactionId, giftCampaigns, giftBatchHeaderId);
                            if (!result)
                                return Json(SerializationHelper.ToJsonResult(null, null, 0, true));
                        }
                        else
                            return Json(SerializationHelper.ToJsonResult(null, null, 0, true));
                    }
                    url = string.Format(baseUrl, transactionId, paymentRequest.Amount, paymentDescription);
                }
                else
                {
                    _logger.LogError(Constants._product, typeof(PaymentController).FullName, "The transaction id couldn't be created");
                }

                return Json(SerializationHelper.ToJsonResult(url));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PaymentController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Successes the specified transaction identifier.
        /// Payment vendor calls this action to indicate transaction was success
        /// </summary>
        /// <param name="transactionId">The transaction identifier.</param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Success(int transactionId)
        {
            try
            {
                People person = null;
                if (TempData[Constants._applicationInfoTempData] != null)
                {
                    dynamic applicationInfo = SerializationHelper.ToObject<object>((string)TempData[Constants._applicationInfoTempData]);
                    string email = applicationInfo.email;
                    string formApplicationName = applicationInfo.formApplicationName;

                    person = new()
                    {
                        Prefix = applicationInfo.prefix,
                        FirstName = applicationInfo.firstName,
                        MiddleName = applicationInfo.middleName,
                        LastName = applicationInfo.lastName,
                        Nickname = applicationInfo.nickname,
                        LastNamePrefix = applicationInfo.lastNamePrefix,
                        LegalName = applicationInfo.legalName,
                        Suffix = applicationInfo.suffix,
                        Email = email
                    };

                    _ = CreateApplicationNotification(email, formApplicationName, person);
                    TempData.Remove(Constants._applicationInfoTempData);
                }

                return GetPaymentTransaction(transactionId, true, person);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PaymentController).FullName, exception.Message, exception);
                return RedirectToAction("Index", "Home");
            }
        }

        public ActionResult RedirectToPaymentApi(string transactionId,
                                                string transactionAmount,
                                                string transactionDescription,
                                                string merchantId)
        {
            try
            {
                CultureInfo objCultureInfo = new CultureInfo("es-MX");
                cOpenPayConfig objOpenPayConfig = cOpenPayConfig.GetOpenPayConfig();

                OpenpayAPI objOpenPayApi = new OpenpayAPI(objOpenPayConfig.OpenPayApiKey, 
                                                          objOpenPayConfig.OpenPayMerchantId, 
                                                          "MX", 
                                                          objOpenPayConfig.OpenPayProduction);

                Customer objCustomer = new Customer();
                ChargeRequest objChargeRequest = new ChargeRequest();
                Charge objCharge;

                InstitutionSettings.Payment settingsPayment = _institutionSettingService.GetPayment();
                string baseUrl = settingsPayment.Balance;
                string redirectUrl = baseUrl.Replace("RedirectToPaymentApi?TransactionId={0}&TransactionAmount={1}&TransactionDescription={2}&MerchantId=SOMEVALUE",
                                                     "FinishPaymentApi?TransactionId=" + transactionId);

                objCustomer.Name = Account.UserName;
                objCustomer.Email = Account.Email;
                objCustomer.Id = Account.PeopleCodeId;

                objChargeRequest.Use3DSecure=true;
                objChargeRequest.Confirm = "false";
                objChargeRequest.Amount = decimal.Parse(transactionAmount, objCultureInfo);
                objChargeRequest.Description = transactionDescription;
                objChargeRequest.SendEmail = false;
                objChargeRequest.Customer = objCustomer;
                objChargeRequest.RedirectUrl = redirectUrl;
                objChargeRequest.Method= "card";

                objCharge = objOpenPayApi.ChargeService.Create(objChargeRequest);

                if (string.IsNullOrEmpty(objCharge.ErrorMessage))
                {

                    IPayment.InsOpenPayTransacyionId(int.Parse(transactionId), objCharge.Id);
                    return Redirect(objCharge.PaymentMethod.Url);
                }
                else
                {
                    IErrorLog.SaveErrorLog("RedirectToPaymentApi: " + objCharge.ErrorMessage);
                    _logger.LogError(Constants._product, typeof(PaymentController).FullName, objCharge.ErrorMessage);
                    return RedirectToAction("Fail", "Payment", new { transactionId = transactionId });
                }

            }
            catch (Exception exception)
            {
                IErrorLog.SaveErrorLog("RedirectToPaymentApi: " + exception.ToString());
                _logger.LogError(Constants._product, typeof(PaymentController).FullName, exception.Message, exception);
                return RedirectToAction("Fail", "Payment", new { transactionId = transactionId });
            }

        }

        public ActionResult FinishPaymentApi(int transactionId)
        {
            try
            {
                cOpenPayConfig objOpenPayConfig = cOpenPayConfig.GetOpenPayConfig();

                OpenpayAPI objOpenPayApi = new OpenpayAPI(objOpenPayConfig.OpenPayApiKey,
                                                          objOpenPayConfig.OpenPayMerchantId,
                                                          "MX",
                                                          objOpenPayConfig.OpenPayProduction);

                string strOpenPayId = IPayment.GetOpenPayId(transactionId);

                Charge objCharge = objOpenPayApi.ChargeService.Get(strOpenPayId);

                IPayment.InsCashReceiptfromWeb(transactionId, objCharge.Authorization);

                return RedirectToAction("Success", "Payment", new { transactionId = transactionId });

            }
            catch (Exception exception)
            {
                IErrorLog.SaveErrorLog("FinishPaymentApi: " + exception.ToString());
                _logger.LogError(Constants._product, typeof(PaymentController).FullName, exception.Message, exception);
                return RedirectToAction("Fail", "Payment", new { transactionId = transactionId });
            }
        }

        #region Private Methods

        /// <summary>
        /// Creates the application notification.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <param name="formApplicationName">Name of the form application.</param>
        /// <param name="application">The application.</param>
        /// <returns></returns>
        private async Task<JsonResult> CreateApplicationNotification(string email, string formApplicationName, People personToEmail)
        {
            try
            {
                bool notificationSend = true;
                if (await _notificationsHelper.EventIsActiveAsync(NotificationEvent.AdmissionsApplicationSubmitted))
                {
                    List<NotificationToken> currentTokens = new();
                    if (Account != null && Account.PersonId > 0)
                    {
                        People person = _peopleService.Get(Account.PersonId);
                        currentTokens = new List<NotificationToken>
                        {
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = email } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.prefix", Value = person.Prefix } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.firstname", Value = person.FirstName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.middlename", Value = person.MiddleName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.lastname", Value = person.LastName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.suffix", Value = person.Suffix } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.nickname", Value = person.Nickname } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.lastnameprefix", Value = person.LastNamePrefix } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.legalname", Value = person.LegalName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "formname", Value = formApplicationName } },
                        };
                    }
                    else if (Account != null && Account.TemporaryUserId > 0)
                    {
                        TemporaryUser person = _temporaryUserService.Get(email);
                        currentTokens = new List<NotificationToken>
                        {
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = email } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.prefix", Value = string.Empty } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.firstname", Value = person.FirstName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.middlename", Value = string.Empty } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.lastname", Value = person.LastName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.suffix", Value = string.Empty } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.nickname", Value = string.Empty } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.lastnameprefix", Value = string.Empty } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.legalname", Value = string.Empty } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "formname", Value = formApplicationName } },
                        };
                    }
                    else if (Account == null)
                    {
                        currentTokens = new List<NotificationToken>
                        {
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = email } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.prefix", Value = personToEmail.Prefix } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.firstname", Value = personToEmail.FirstName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.middlename", Value = personToEmail.MiddleName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.lastname", Value = personToEmail.LastName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.suffix", Value = personToEmail.Suffix } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.nickname", Value = personToEmail.Nickname } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.lastnameprefix", Value = personToEmail.LastNamePrefix } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.legalname", Value = personToEmail.LegalName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "formname", Value = formApplicationName } }
                        };
                    }
                    _notificationsHelper.Create(new NotificationEventModel
                    {
                        EventKey = NotificationEvent.AdmissionsApplicationSubmitted,
                        Tokens = currentTokens
                    });
                }
                else
                {
                    _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, "Notification is not Active: " + NotificationEvent.AdmissionsApplicationSubmitted);
                    notificationSend = false;
                }
                return Json(SerializationHelper.ToJsonResult(notificationSend));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the payment transaction.
        /// </summary>
        /// <param name="transactionId">The transaction identifier.</param>
        /// <param name="isSuccess">The success flag.</param>
        /// <param name="person">The person to email.</param>
        /// <returns></returns>
        private ActionResult GetPaymentTransaction(int transactionId, bool isSuccess, People person)
        {
            if (transactionId > 0)
            {
                PaymentTransactionDetail paymentTransactionDTO = _paymentService.GetTransaction(transactionId);
                if (paymentTransactionDTO != null)
                {
                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    PaymentTransactionViewModel paymentTransaction = paymentTransactionDTO.ToViewModel(general.CurrencyCulture);
                    if (HttpContext.Session.GetObject<string>(Constants._paymentReturnUrlSession) != null)
                    {
                        paymentTransaction.ReturnUrl = HttpContext.Session.GetObject<string>(Constants._paymentReturnUrlSession);
                        HttpContext.Session.Remove(Constants._paymentReturnUrlSession);
                    }
                    TempData[Constants._paymentTransactionTempData] = SerializationHelper.ToJsonObject(paymentTransaction);
                    YearTermSessionModel yearTermSession = null;
                    if (paymentTransactionDTO.Year != null && !string.IsNullOrEmpty(paymentTransactionDTO.Term))
                    {
                        yearTermSession = new YearTermSessionModel
                        {
                            Year = paymentTransactionDTO.Year.Value,
                            Term = paymentTransactionDTO.Term,
                            Session = paymentTransactionDTO.Session
                        };
                    }
                    _ = SendNotificationAsync(paymentTransactionDTO, isSuccess, person);
                    switch (paymentTransactionDTO.Area)
                    {
                        case PaymentOrigin.Registration:
                            return RedirectToAction("Courses", "Registration", yearTermSession);

                        case PaymentOrigin.MakePayment:
                            if (paymentTransactionDTO.PersonId != Account.PersonId)
                                return RedirectToAction("StudentProfile", "SharedAccess", new { paymentTransactionDTO.PersonId });
                            return RedirectToAction("Balance", "Finances", yearTermSession);

                        case PaymentOrigin.Application:
                            int id = 0;
                            int? applicationFormSettingIdSession = HttpContext.Session.GetObject<int?>(Constants._applicationFormSettingIdSession);
                            if (applicationFormSettingIdSession != null)
                            {
                                id = (int)applicationFormSettingIdSession;
                                HttpContext.Session.Remove(Constants._applicationFormSettingIdSession);
                            }
                            return RedirectToAction("ApplicationForm", "Admissions", new { id });

                        case PaymentOrigin.TranscriptRequest:
                            return RedirectToAction("RequestTranscript", "Grades");

                        case PaymentOrigin.ConEdRegistration:
                            return RedirectToAction("ConEdCourses", "ContinuingEducation");

                        case PaymentOrigin.OnlineDonation:
                            if (HttpContext.Session.GetObject<Account>(Constants._accountSession) != null)
                                HttpContext.Session.Remove(Constants._accountSession);
                            return RedirectToAction("MakeGift", "MakeGift");

                        case PaymentOrigin.PowerCampusReceipt:
                        case PaymentOrigin.PowerCampusGift:
                            return RedirectToAction("Index", "PaymentResult");
                    }

                    _logger.LogError(Constants._product, typeof(PaymentController).FullName, "There is no match for the payment origin");
                    return RedirectToAction("Index", "Home");
                }
                _logger.LogError(Constants._product, typeof(PaymentController).FullName, "The transaction detail is null");
                return RedirectToAction("Index", "Home");
            }
            _logger.LogError(Constants._product, typeof(PaymentController).FullName, "The transaction id is zero");
            return RedirectToAction("Index", "Home");
        }

        /// <summary>
        /// Gets the people tokens.
        /// </summary>
        /// <param name="person">The person.</param>
        /// <param name="tokenId">The token identifier.</param>
        /// <returns></returns>
        private List<NotificationToken> GetPeopleTokens(People person, string tokenId)
        {
            return new()
            {
                new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = person.Email } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.prefix", Value = person.Prefix } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.firstname", Value = person.FirstName } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.displayname", Value = person.DisplayName } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.middlename", Value = person.MiddleName } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.lastname", Value = person.LastName } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.suffix", Value = person.Suffix } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.nickname", Value = person.Nickname } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.lastnameprefix", Value = person.LastNamePrefix } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.legalname", Value = person.LegalName } }
            };
        }

        /// <summary>
        /// Sends the notification asynchronous.
        /// </summary>
        /// <param name="paymentTransactionDTO">The payment transaction.</param>
        /// <param name="isSuccess">if set to <c>true</c> [is success].</param>
        /// <param name="personToEmail">The person that will receive the email.</param>
        private async Task SendNotificationAsync(PaymentTransactionDetail paymentTransactionDTO, bool isSuccess, People personToEmail = null)
        {
            InstitutionSettings.General general = _institutionSettingService.GetGeneral();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
            IFormatProvider formatProvider = FormatHelper.GetCustomNumberFormat(general.NumberCulture);
            string eventNotification = string.Empty;
            switch (paymentTransactionDTO.Area)
            {
                case PaymentOrigin.Registration:
                    if (isSuccess)
                        eventNotification = NotificationEvent.TradRegPaymentSuccess;
                    else
                        eventNotification = NotificationEvent.TradRegPaymentFailed;
                    break;

                case PaymentOrigin.MakePayment:
                    if (isSuccess)
                        eventNotification = NotificationEvent.FinancesBalancePaymentSuccess;
                    else
                        eventNotification = NotificationEvent.FinancesBalancePaymentFailed;
                    break;

                case PaymentOrigin.Application:
                    if (isSuccess)
                        eventNotification = NotificationEvent.AdmissionsApplicationPaymentSuccess;
                    else
                        eventNotification = NotificationEvent.AdmissionsApplicationPaymentFailed;
                    break;

                case PaymentOrigin.TranscriptRequest:
                    if (isSuccess)
                        eventNotification = NotificationEvent.TranscriptRequestPaymentSuccess;
                    else
                        eventNotification = NotificationEvent.TranscriptRequestPaymentFailed;
                    break;

                case PaymentOrigin.ConEdRegistration:
                    if (isSuccess)
                        eventNotification = NotificationEvent.ConEdPaymentSuccess;
                    else
                        eventNotification = NotificationEvent.ConEdPaymentFail;
                    break;

                case PaymentOrigin.OnlineDonation:
                    if (isSuccess)
                        eventNotification = NotificationEvent.DonationsPaymentSuccess;
                    break;
            }
            bool isActive = await _notificationsHelper.EventIsActiveAsync(eventNotification).ConfigureAwait(false);
            if (!isActive)
                return;

            List<NotificationToken> currentTokens;
            string tokenId = string.Empty;
            if (eventNotification == NotificationEvent.AdmissionsApplicationPaymentSuccess || eventNotification == NotificationEvent.AdmissionsApplicationPaymentFailed)
                tokenId = "applicantname";
            else
                tokenId = "name";

            if (Account?.PersonId > 0)
            {
                People person = _peopleService.Get(Account.PersonId);
                if (eventNotification == NotificationEvent.DonationsPaymentSuccess)
                {
                    Campaign campaigns = _donationService.GetCampaigns(paymentTransactionDTO.TransactionId);
                    currentTokens = new List<NotificationToken>
                    {
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = person.Email } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "giftpledge.date", Value = FormatHelper.ToShortDate(campaigns.EndDate, datetimeCulture) } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "giftpledge.totalamount", Value = FormatHelper.ToDecimal(campaigns.TotalAmount, formatCurrency) } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.prefix", Value = person.Prefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.firstname", Value = person.FirstName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.displayname", Value = person.DisplayName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.middlename", Value = person.MiddleName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.lastname", Value = person.LastName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.suffix", Value = person.Suffix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.nickname", Value = person.Nickname } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.lastnameprefix", Value = person.LastNamePrefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.legalname", Value = person.LegalName } }
                    };

                    if (campaigns.GiftCampaigns.Count > 0)
                    {
                        NotificationTokenDetail campaignsTokens = new()
                        {
                            Id = "giftcampaings",
                            ValueList = new List<NotificationToken>()
                        };
                        foreach (GiftCampaign giftCampaign in campaigns.GiftCampaigns)
                        {
                            campaignsTokens.ValueList.Add(new NotificationToken
                            {
                                Token = new NotificationTokenDetail
                                {
                                    Id = "giftcampaings",
                                    ValueList =
                                        new List<NotificationToken>{
                                            new NotificationToken {Token = new NotificationTokenDetail {Id = "giftpledgedetail.campaignname",Value = giftCampaign.Description }},
                                            new NotificationToken {Token = new NotificationTokenDetail {Id = "giftpledgedetail.amount",Value = FormatHelper.ToDecimal(giftCampaign.Amount, formatCurrency)}
                                        }
                                    }
                                }
                            });
                        }
                        currentTokens.Add(new NotificationToken { Token = campaignsTokens });
                    }
                }
                else
                {
                    currentTokens = GetPeopleTokens(person, tokenId);
                }
            }
            else if (Account?.TemporaryUserId > 0)
            {
                TemporaryUser temporaryUser = _temporaryUserService.Get(Account.UserName);
                currentTokens = new()
                {
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = temporaryUser.Email } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.prefix", Value = string.Empty } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.firstname", Value = temporaryUser.FirstName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.displayname", Value = string.Empty } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.middlename", Value = string.Empty } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.lastname", Value = temporaryUser.LastName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.suffix", Value = string.Empty } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.nickname", Value = string.Empty } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.lastnameprefix", Value = string.Empty } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.legalname", Value = string.Empty } }
                };
            }
            else if (personToEmail is not null)
            {
                currentTokens = new()
                {
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = personToEmail.Email } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.prefix", Value = personToEmail.Prefix } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.firstname", Value = personToEmail.FirstName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.displayname", Value = personToEmail.DisplayName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.middlename", Value = personToEmail.MiddleName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.lastname", Value = personToEmail.LastName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.suffix", Value = personToEmail.Suffix } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.nickname", Value = personToEmail.Nickname } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.lastnameprefix", Value = personToEmail.LastNamePrefix } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = $"{tokenId}.legalname", Value = personToEmail.LegalName } }
                };
            }
            else
            {
                return;
            }
            if (isSuccess)
            {
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.number", Value = paymentTransactionDTO.ReceiptNumber != null ? FormatHelper.ToNumber((int)paymentTransactionDTO.ReceiptNumber, formatProvider) : string.Empty }
                });
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.peopleorgid", Value = paymentTransactionDTO.ReceiptPeopleOrgId ?? string.Empty }
                });
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.year", Value = paymentTransactionDTO.ReceiptYear ?? string.Empty }
                });
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.term", Value = paymentTransactionDTO.ReceiptTerm ?? string.Empty }
                });
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.session", Value = paymentTransactionDTO.ReceiptSession ?? string.Empty }
                });
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.entrydate", Value = paymentTransactionDTO.ReceiptEntryDate != null ? FormatHelper.ToShortDate(paymentTransactionDTO.ReceiptEntryDate, datetimeCulture) : string.Empty }
                });
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.office", Value = paymentTransactionDTO.ReceiptOffice ?? string.Empty }
                });
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.paymenttype", Value = paymentTransactionDTO.ReceiptPaymentType ?? string.Empty }
                });
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.code", Value = paymentTransactionDTO.ReceiptCode ?? string.Empty }
                });
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.description", Value = paymentTransactionDTO.ReceiptDesc ?? string.Empty }
                });
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.amount", Value = paymentTransactionDTO.ReceiptAmount != null ? FormatHelper.ToDecimal(paymentTransactionDTO.ReceiptAmount, formatCurrency) : string.Empty }
                });
                currentTokens.Add(new NotificationToken
                {
                    Token = new NotificationTokenDetail { Id = "receipt.operator", Value = paymentTransactionDTO.ReceiptOperator ?? string.Empty }
                });
            }
            _notificationsHelper.Create(new NotificationEventModel
            {
                EventKey = eventNotification,
                Tokens = currentTokens
            });
        }

        #endregion Private Methods
    }
}