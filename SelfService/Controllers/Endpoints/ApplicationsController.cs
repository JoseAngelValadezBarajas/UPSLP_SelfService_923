// --------------------------------------------------------------------
// <copyright file="ApplicationsController.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Constants;
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
using Microsoft.Practices.EnterpriseLibrary.Data;
using SelfService.Data;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Finances;
using SelfService.Models.Forms;
using SelfService.Models.Payment;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Applications route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class ApplicationsController : BaseEndpointController
    {
        /// <summary>
        /// The application service
        /// </summary>
        private readonly IApplicationService _applicationService;

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
        private readonly IAppLogger<ApplicationsController> _logger;

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

        private readonly IReportHelper _reportHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationsController"/> class.
        /// </summary>
        /// <param name="applicationService">The application service.</param>
        /// <param name="formService">The form service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="logger">The logger.</param>
        public ApplicationsController(
            IApplicationService applicationService,
            IFormService formService,
            IInstitutionSettingService institutionSettingService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            ISerializationHelper serializationHelper,
            ITemporaryUserService temporaryUserService,
            IReportHelper reportHelper,
            IAppLogger<ApplicationsController> logger)
            : base(serializationHelper)
        {
            _applicationService = applicationService;
            _formService = formService;
            _institutionSettingService = institutionSettingService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _temporaryUserService = temporaryUserService;
            _reportHelper = reportHelper;

            _logger = logger;
        }

        /// <summary>
        /// Creates the application.
        /// </summary>
        /// <param name="application">The application.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Applications/Create")]
        public JsonResult Create([FromBody] Application application)
        {
            try
            {
                //TODO change value for ApplicationId to FormSettingId
                bool result = false;
                int applicationId = 0;
                if (application == null)
                    return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
                if (!application.Policy)
                {
                    _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, "Policy has not been accepted.");
                    return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
                }
                FormSettings formSettings = _formService.GetApplicationById(application.ApplicationId);
                if (ValidateMinimumRequiredFields(application) && _applicationService.IsValid(application))
                {
                    application.FormSettingId = application.ApplicationId;
                    applicationId = _applicationService.Create(application, formSettings.EnableOnlinePayment, accept: true);
                }
                result = applicationId > 0;
                string email = string.Empty;
                if (result && application.SavedApplicationId > 0)
                {
                    if (_applicationService.DeleteSaved(application.SavedApplicationId.Value) == 1)
                        result = true;
                }
                else if (result)
                {
                    if (Account != null)
                    {
                        if (Account.PersonId > 0)
                            email = Account.Email;
                        else if (Account.TemporaryUserId > 0)
                            email = Account.TemporaryEmail;
                    }
                    else if (application.Email != null)
                    {
                        email = application.Email;
                    }
                }
                // Payment Info
                ApplicationPaymentSettings applicationPayment = _formService.GetApplicationPaymentSettings(applicationId);
                PaymentInfoViewModel paymentInfo = null;
                if (result)
                {
                    if (applicationPayment.EnableOnlinePayment)
                    {
                        string currencyCultureFormat = _institutionSettingService.GetGeneral().CurrencyCulture;
                        IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(currencyCultureFormat);
                        decimal totalAmount = 0;
                        if (applicationPayment.IsFlatFee)
                            totalAmount = applicationPayment.FeeAmount;
                        else
                            totalAmount = applicationPayment.FeeAmount * applicationPayment.ProgramsCount;
                        paymentInfo = new PaymentInfoViewModel
                        {
                            TotalAmount = FormatHelper.ToCurrency(totalAmount, formatCurrency),
                            TotalAmountValue = totalAmount,
                            ChargeCredits = new List<DiscountChargeCreditViewModel>()
                        };
                        paymentInfo.ChargeCredits.Add(new DiscountChargeCreditViewModel
                        {
                            Amount = FormatHelper.ToCurrency(applicationPayment.FeeAmount, formatCurrency),
                            Description = applicationPayment.Description
                        });
                        paymentInfo.ApplicationId = applicationId;

                        TempData[Constants._applicationInfoTempData] = SerializationHelper.ToJsonObject(new
                        {
                            Email = email,
                            FormApplicationName = formSettings.Name,
                            Prefix = application.Prefix,
                            FirstName = application.FirstName,
                            MiddleName = application.MiddleName,
                            LastName = application.LastName,
                            Nickname = application.Nickname,
                            LastNamePrefix = application.LastNamePrefix,
                            LegalName = application.LegalName,
                            Suffix = application.Suffix
                        });
                    }
                    else
                    {
                        _ = CreateApplicationNotification(email, formSettings.Name, application);
                    }
                }

                return Json(SerializationHelper.ToJsonResult(new
                {
                    applicationId,
                    result,
                    paymentInfo
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Creates the application attachment.
        /// </summary>
        /// <param name="applicationAttachment">The application attachment.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Applications/CreateApplicationAttachment")]
        [AllowAnonymous]
        public JsonResult CreateApplicationAttachment([FromBody] ApplicationAttachment applicationAttachment)
        {
            try
            {
                bool result = _applicationService.CreateAttachment(applicationAttachment);
                return Json(SerializationHelper.ToJsonResult(new { result }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Creates the application notification.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <param name="formApplicationName">Name of the form application.</param>
        /// <param name="application">The application.</param>
        /// <returns></returns>
        public async Task<JsonResult> CreateApplicationNotification(string email, string formApplicationName, Application application)
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
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.prefix", Value = string.Empty } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.firstname", Value = application.FirstName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.middlename", Value = application.MiddleName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.lastname", Value = application.LastName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.suffix", Value = string.Empty } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.nickname", Value = application.Nickname } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.lastnameprefix", Value = application.LastNamePrefix } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.legalname", Value = application.LegalName } },
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
        /// Creates the save application notification.
        /// </summary>
        /// <param name="applicationNotificationModel">The application notification model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Applications/CreateSaveApplicationNotification")]
        public async Task<JsonResult> CreateSaveApplicationNotification([FromBody] ApplicationNotificationModel applicationNotificationModel)
        {
            try
            {
                bool notificationSend = true;
                if (await _notificationsHelper.EventIsActiveAsync(NotificationEvent.AdmissionsApplicationIncomplete))
                {
                    string email = applicationNotificationModel.Email;
                    string formApplicationName = applicationNotificationModel.FormApplicationName;
                    string urlToSend = applicationNotificationModel.UrlToSend;
                    List<NotificationToken> currentTokens = new();
                    if (Account.PersonId > 0)
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
                                new NotificationToken { Token = new NotificationTokenDetail { Id = "applicationurl", Value = urlToSend } },
                            };
                    }
                    else if (Account.TemporaryUserId > 0)
                    {
                        TemporaryUser person = _temporaryUserService.Get(email);
                        currentTokens = new List<NotificationToken>
                            {
                                new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = email } },
                                new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.firstname", Value = person.FirstName } },
                                new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.middlename", Value = string.Empty } },
                                new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.lastname", Value = person.LastName } },
                                new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.suffix", Value = string.Empty } },
                                new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.nickname", Value = string.Empty } },
                                new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.lastnameprefix", Value = string.Empty } },
                                new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.legalname", Value = string.Empty } },
                                new NotificationToken { Token = new NotificationTokenDetail { Id = "formname", Value = formApplicationName } },
                                new NotificationToken { Token = new NotificationTokenDetail { Id = "applicationurl", Value = urlToSend } },
                            };
                    }
                    _notificationsHelper.Create(new NotificationEventModel
                    {
                        EventKey = NotificationEvent.AdmissionsApplicationIncomplete,
                        Tokens = currentTokens
                    });
                }
                else
                {
                    _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, "Notification is not Active: " + NotificationEvent.AdmissionsApplicationIncomplete);
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
        /// Creates the saved application.
        /// </summary>
        /// <param name="savedApplicationModel">The saved application model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Applications/CreateSavedApplication")]
        public JsonResult CreateSavedApplication([FromBody] JsonElement body)
        {
            try
            {
                SavedApplicationModel savedApplicationModel = SerializationHelper.ToObject<SavedApplicationModel>(body.ToString());
                SavedApplication savedApplication = savedApplicationModel.SavedApplication;
                ApplicationFormViewModel components = savedApplicationModel.Components;
                if (string.IsNullOrEmpty(savedApplication.Email))
                    return Json(SerializationHelper.ToJsonResult(null, null, 0, false));

                if (Account?.PersonId > -1)
                    savedApplication.PersonId = Account.PersonId;

                savedApplication.Token = Guid.NewGuid();
                savedApplication.JsonDetail = (string)SerializationHelper.ToJsonObject(components);
                bool result = _applicationService.CreateSaved(savedApplication) > 0;

                if (result)
                {
                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        result,
                        savedApplication.Token,
                        savedApplication.Email
                    }));
                }

                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the application attachment.
        /// </summary>
        /// <param name="attachmentId">The attachment identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Applications/DeleteApplicationAttachment")]
        public JsonResult DeleteApplicationAttachment([FromBody] int attachmentId)
        {
            try
            {
                bool result = _applicationService.DeleteAttachment(attachmentId);
                return Json(SerializationHelper.ToJsonResult(new { result }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Deletes the saved application.
        /// </summary>
        /// <param name="savedApplicationId">The saved application identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Forms/DeleteSavedApplication")]
        public JsonResult DeleteSavedApplication([FromBody] int savedApplicationId)
        {
            try
            {
                bool result = _applicationService.DeleteSaved(savedApplicationId) == 1;
                return Json(SerializationHelper.ToJsonResult(new { result }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the application attachment totals.
        /// </summary>
        /// <param name="applicationId">The application identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Applications/GetApplicationAttachmentTotals")]
        public JsonResult GetApplicationAttachmentTotals([FromBody] int applicationId)
        {
            try
            {
                ApplicationAttachmentTotals appAttachmentTotals = _applicationService.GetAttachmentTotals(applicationId);
                string numberCultureFormat = _institutionSettingService.GetGeneral().NumberCulture;
                ApplicationAttachmentTotalsViewModel appAttachmentTotalsViewModel = appAttachmentTotals.ToViewModel(numberCultureFormat);
                return Json(SerializationHelper.ToJsonResult(new { appAttachmentTotalsViewModel }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the ReCaptcha settings for applicatiom submission.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Applications/RecaptchaSettings")]
        public JsonResult GetRecaptchaSettings()
        {
            try
            {
                bool isReCaptchaSubmitApplicationEnabled = false;
                string reCaptchaSiteKey = string.Empty;

                InstitutionSettings.ReCaptcha reCaptchaSettings = _institutionSettingService.GetReCaptcha();
                isReCaptchaSubmitApplicationEnabled = reCaptchaSettings.EnableSubmitApplication;
                reCaptchaSiteKey = reCaptchaSettings.SiteKey;

                return Json(SerializationHelper.ToJsonResult(new
                {
                    isReCaptchaSubmitApplicationEnabled,
                    reCaptchaSiteKey
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the submitted applications.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Applications/GetSubmittedApplications")]
        public JsonResult GetSubmittedApplications()
        {
            try
            {
                List<SubmittedApplication> submittedApplications = _applicationService.GetSubmitted(Account.PersonId);
                string dateTimeCultureFormat = _institutionSettingService.GetGeneral().DateTimeCulture;
                return Json(SerializationHelper.ToJsonResult(new { submittedApplications = submittedApplications?.ToViewModel(dateTimeCultureFormat) }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Lists the application attachments.
        /// </summary>
        /// <param name="applicationId">The application identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Applications/ListApplicationAttachments")]
        public JsonResult ListApplicationAttachments([FromBody] int applicationId)
        {
            try
            {
                List<ApplicationAttachment> appAttachments = _applicationService.GetAttachments(applicationId);
                string numberCultureFormat = _institutionSettingService.GetGeneral().NumberCulture;
                List<ApplicationAttachmentViewModel> appAttachmentsViewModel = appAttachments.ToViewModel(numberCultureFormat);
                return Json(SerializationHelper.ToJsonResult(new { appAttachmentsViewModel }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Updates the saved application.
        /// </summary>
        /// <param name="savedApplication">The saved application.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Forms/UpdateSavedApplication")]
        public JsonResult UpdateSavedApplication([FromBody] JsonElement body)
        {
            try
            {
                SavedApplicationModel savedApplicationModel = SerializationHelper.ToObject<SavedApplicationModel>(body.ToString());
                SavedApplication savedApplication = savedApplicationModel.SavedApplication;
                ApplicationFormViewModel components = savedApplicationModel.Components;
                bool result = false;
                if (savedApplication.Token != default)
                {
                    savedApplication.SavedApplicationId = _applicationService.GetSaved(savedApplication.Token);
                    if (savedApplication.SavedApplicationId > 0)
                    {
                        savedApplication.JsonDetail = (string)SerializationHelper.ToJsonObject(components);
                        result = _applicationService.UpdateSaved(savedApplication) == 1;
                    }
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    result,
                    savedApplication.Token,
                    savedApplication.Email
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Validates the required fields.
        /// </summary>
        /// <param name="application">The application.</param>
        /// <returns></returns>
        private bool ValidateMinimumRequiredFields(Application application)
        {
            bool isValid = true;
            StringBuilder messages = new();
            messages.Append("Required Fields for Application are missing: ");

            if (application != null)
            {
                if (string.IsNullOrEmpty(application.FirstName))
                {
                    isValid = false;
                    messages.Append("FirstName,");
                }
                if (string.IsNullOrEmpty(application.LastName))
                {
                    isValid = false;
                    messages.Append("LastName,");
                }
                if (application.Addresses == null)
                {
                    isValid = false;
                    messages.Append("Address,");
                }
                else
                {
                    foreach (FormAddress applicationAddress in application.Addresses)
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

                if (application.Period == 0)
                {
                    isValid = false;
                    messages.Append("Period,");
                }

                if (application.Programs == null)
                {
                    isValid = false;
                    messages.Append("ProgramList,");
                }
                else
                {
                    foreach (FormProgram program in application.Programs)
                    {
                        if (program.ProgramId == 0)
                        {
                            isValid = false;
                            messages.Append("Program.ProgramId,");
                            break;
                        }
                    }
                }
            }
            if (!isValid)
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, messages.ToString().Remove(messages.Length - 1, 1));

            return isValid;
        }

        [HttpGet]
        public JsonResult GetValidateCurp(string curp, int IdForm)
        {
            string strValidate;
            try
            {
                strValidate = IAdmissions.GetValidateCurp(curp, IdForm);

                return Json(SerializationHelper.ToJsonResult(strValidate));
            }
            catch (Exception exception)
            {
                IErrorLog.SaveErrorLog(exception.ToString());
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        [HttpGet]
        public ActionResult GetPagoReferAdmision(int applicationId)
        {
            try
            {
                byte[] report = _reportHelper.GetPagoReferAdmission(applicationId);
                return File(report, "application/pdf", "ReferenciaPago.pdf");
            }
            catch (Exception exception)
            {
                IErrorLog.SaveErrorLog("Error GetPagoReferAdmision " + exception.ToString());
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

        [HttpGet]
        public ActionResult GetPagoReferAdmisionByCurp(string curp, int IdForm)
        {
            try
            {
                int IdApp;
                IdApp = IAdmissions.GetIdAppCurp(curp, IdForm);
                byte[] report = _reportHelper.GetPagoReferAdmission(IdApp);
                return File(report, "application/pdf", "ReferenciaPago.pdf");
            }
            catch (Exception exception)
            {
                IErrorLog.SaveErrorLog("Error GetPagoReferAdmisionByCurp " + exception.ToString());
                _logger.LogError(Constants._product, typeof(ApplicationsController).FullName, exception.Message, exception);
                return new EmptyResult();
            }
        }

    }
}