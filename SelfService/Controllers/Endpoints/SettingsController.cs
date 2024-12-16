// --------------------------------------------------------------------
// <copyright file="SettingsController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Administration;
using SelfService.Models.Administration.Instructor;
using SelfService.Models.Administration.Profile;
using SelfService.Models.Payment;
using SelfService.Models.ResourcesTypes.Administration;
using SelfService.Models.Setting;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using static Hedtech.PowerCampus.Core.DTO.Settings.InstitutionSettings;
using TranscriptRequest = Hedtech.PowerCampus.Core.DTO.Settings.InstitutionSettings.TranscriptRequest;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Settings route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(NoDirectAccessAttribute))]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class SettingsController : BaseEndpointController
    {
        /// <summary>
        /// The address request service
        /// </summary>
        private readonly IAddressRequestService _addressRequestService;

        /// <summary>
        /// The agreement service
        /// </summary>
        private readonly IAgreementService _agreementService;

        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The connection strings
        /// </summary>
        private readonly ConnectionStrings _connectionStrings;

        /// <summary>
        /// The environment
        /// </summary>
        private readonly IWebHostEnvironment _environment;

        /// <summary>
        /// The grade service
        /// </summary>
        private readonly IGradeService _gradesService;

        /// <summary>
        /// The institution setting filter service
        /// </summary>
        private readonly IInstitutionSettingFilterService _institutionSettingFilterService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<SettingsController> _logger;

        /// <summary>
        /// The period service
        /// </summary>
        private readonly IPeriodService _periodService;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// The setting service
        /// </summary>
        private readonly ISettingService _settingService;

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsController"/> class.
        /// </summary>
        /// <param name="agreementService">The address request service.</param>
        /// <param name="agreementService">The agreement service.</param>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="connectionStrings">The connection strings.</param>
        /// <param name="environment">The environment.</param>
        /// <param name="gradeService">The grade service.</param>
        /// <param name="institutionSettingFilterService">The institution setting filter service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="periodService">The period service.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="settingService">The setting service.</param>
        /// <param name="logger">The logger.</param>
        public SettingsController(
            IAddressRequestService addressRequestService,
            IAgreementService agreementService,
            ICodeTableService codeTableService,
            IGradeService gradeService,
            IInstitutionSettingFilterService institutionSettingFilterService,
            IInstitutionSettingService institutionSettingService,
            IOptions<ConnectionStrings> connectionStrings,
            IPeriodService periodService,
            IResourcesHelper resourcesHelper,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            ISettingService settingService,
            IWebHostEnvironment environment,
            IAppLogger<SettingsController> logger)
            : base(serializationHelper)
        {
            _addressRequestService = addressRequestService;
            _agreementService = agreementService;
            _codeTableService = codeTableService;
            _connectionStrings = connectionStrings.Value;
            _environment = environment;
            _gradesService = gradeService;
            _institutionSettingFilterService = institutionSettingFilterService;
            _institutionSettingService = institutionSettingService;
            _periodService = periodService;
            _resourcesHelper = resourcesHelper;
            _settingHelper = settingHelper;
            _settingService = settingService;

            _logger = logger;
        }

        #region Checklist

        [HttpGet]
        [Route("Settings/Checklist")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupChecklist } })]
        public JsonResult Checklist()
        {
            try
            {
                InstitutionSettings.Checklist settings = _institutionSettingService.GetChecklist();
                return Json(SerializationHelper.ToJsonResult(settings));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the checklist.
        /// </summary>
        /// <param name="checklistModel">The checklist model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Checklist/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupChecklist } })]
        public JsonResult SaveChecklist([FromBody] ChecklistModel checklistModel)
        {
            try
            {
                bool showSummaryDashboard = checklistModel.ShowSummaryDashboard;
                int thresholdDays = checklistModel.ThresholdDays;
                string startDate = checklistModel.StartDate;
                InstitutionSettings.Checklist checklistSetup = new()
                {
                    DateFromItemDisplay = startDate,
                    DaysShowTask = thresholdDays,
                    ShowTask = showSummaryDashboard
                };
                bool result = _institutionSettingService.SaveChecklist(checklistSetup, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(ChecklistController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Checklist

        #region ConEd Registration

        /// <summary>
        /// Cons the ed registration.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/ConEdRegistration")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationConEdSetupConEdRegistration } })]
        public JsonResult ConEdRegistration()
        {
            try
            {
                List<ListOptionViewModel> cashReceiptCodes = _codeTableService.GetCashReceiptCodes().ToViewModel(true);
                List<ListOptionViewModel> cashReceiptOffices = _codeTableService.GetByName(CodeTableName.Office, true).ToViewModel(true);
                List<ListOptionViewModel> agreements = _agreementService.GetPublished(AgreementType.ConEdRegistration).ToViewModel();
                List<ListOptionViewModel> emailTypes = _codeTableService.GetByName(CodeTableName.EmailType, true).ToViewModel(true);
                List<ListOptionViewModel> pictureDirections = _codeTableService.GetPictureDirections().ToViewModel(false);
                InstitutionSettings.ConEdRegistration settings = _institutionSettingService.GetConEdRegistration();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    settings,
                    agreements,
                    cashReceiptCodes,
                    cashReceiptOffices,
                    emailTypes,
                    pictureDirections
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the con ed registration.
        /// </summary>
        /// <param name="conEdRegistration">The con ed registration.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/ConEdRegistration")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationConEdSetupConEdRegistration } })]
        public JsonResult SaveConEdRegistration([FromBody] InstitutionSettings.ConEdRegistration conEdRegistration)
        {
            try
            {
                bool result = false;
                if (!conEdRegistration.EnableOnlinePayment
                    || (GetPaymentValidation(false, PaymentOrigin.ConEdRegistration)
                    && conEdRegistration.CashReceiptCode > 0
                    && conEdRegistration.CashReceiptOffice > 0))
                {
                    result = _institutionSettingService.SaveConEdRegistration(conEdRegistration, Account.PersonId);
                }

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion ConEd Registration

        #region Demographic Pages

        /// <summary>
        /// Gets Demographic Settings
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/Demographic")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationProfileSetupDemographic } })]
        public JsonResult Demographic()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetDemographic()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the Demographic settings.
        /// </summary>
        /// <param name="demographic">The demographic.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Demographic")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationProfileSetupDemographic } })]
        public JsonResult SaveDemographic([FromBody] InstitutionSettings.Demographic demographic)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(null, null, 0,
                    _institutionSettingService.SaveDemographic(demographic, Account.PersonId)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Demographic Pages

        #region Donation

        /// <summary>
        /// Donations this instance.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/Donation")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationDonationsSetupGiftBatchDefaults } })]
        public JsonResult Donation()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(new
                {
                    hasPaymentProviderUrl = !string.IsNullOrEmpty(_institutionSettingService.GetPayment().Donations),
                    settings = _institutionSettingService.GetDonation()
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the donation.
        /// </summary>
        /// <param name="donation">The donation.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Donation/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationDonationsSetupGiftBatchDefaults } })]
        public JsonResult SaveDonation([FromBody] InstitutionSettings.Donation donation)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(null, null, 0,
                    _institutionSettingService.SaveDonation(donation, Account.PersonId)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Donation

        #region EmergencyContacts

        /// <summary>
        /// Emergencies the contacts.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/EmergencyContacts")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationProfileSetupEmergencyContacts } })]
        public JsonResult EmergencyContacts()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetEmergencyContacts()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the emergency contacts.
        /// </summary>
        /// <param name="emergencyContacts">The emergency contacts.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/EmergencyContacts/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationProfileSetupEmergencyContacts } })]
        public JsonResult SaveEmergencyContacts([FromBody] EmergencyContacts emergencyContacts)
        {
            try
            {
                bool result = _institutionSettingService.SaveEmergencyContacts(emergencyContacts, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion EmergencyContacts

        #region Faculty Pages

        /// <summary>
        /// Gets CourseManagement Settings
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/CourseManagement")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationInstructorSetupCourseManagement } })]
        public JsonResult CourseManagement()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetCourseManagement()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the course management.
        /// </summary>
        /// <param name="courseManagement">The course management.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/CourseManagement")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationInstructorSetupCourseManagement } })]
        public JsonResult SaveCourseManagement([FromBody] InstitutionSettings.CourseManagement courseManagement)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(null, null, 0,
                    _institutionSettingService.SaveCourseManagement(courseManagement, Account.PersonId)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Faculty Pages

        #region Financial

        /// <summary>
        /// Gets Financial Settings
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/Financial")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupFinancialSettings } })]
        public JsonResult Financial()
        {
            try
            {
                List<ListOptionViewModel> cashReceiptCodes = _codeTableService.GetCashReceiptCodes().ToViewModel(true);
                List<ListOptionViewModel> cashReceiptOffices = _codeTableService.GetByName(CodeTableName.Office, true).ToViewModel(true);
                List<ListOptionViewModel> paymentPeriodsSelected = _periodService.GetForPayment().ToViewModel(true, false, true);
                List<ListOptionViewModel> paymentPeriods = _periodService.GetNotSelectedForPayment().ToViewModel(true, false, true);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    settings = _institutionSettingService.GetFinancial(),
                    cashReceiptCodes,
                    cashReceiptOffices,
                    paymentPeriodsSelected,
                    paymentPeriods
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the financial.
        /// </summary>
        /// <param name="settingFinancialModel">The setting financial model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Financial")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupFinancialSettings } })]
        public JsonResult SaveFinancial([FromBody] SettingFinancialModel settingFinancialModel)
        {
            try
            {
                bool result = false;
                if (settingFinancialModel != null)
                {
                    InstitutionSettings.Financial financial = settingFinancialModel.Financial;
                    List<PaymentPeriod> paymentPeriods = settingFinancialModel.PaymentPeriods;
                    if (!financial.EnableOnlinePayment
                        || (GetPaymentValidation(false, PaymentOrigin.Registration)
                        && financial.CashReceiptCode > 0
                        && financial.CashReceiptOffice > 0
                        && paymentPeriods?.Count > 0))
                    {
                        result = _periodService.SaveForPayment(paymentPeriods);
                        if (result)
                            result = _institutionSettingService.SaveFinancial(financial, Account.PersonId);
                    }
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Financial

        #region Form

        /// <summary>
        /// Forms this instance.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/Form")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationDonationsSetupForm } })]
        public JsonResult Form()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(new
                {
                    settings = _institutionSettingService.GetForm()
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the form.
        /// </summary>
        /// <param name="forms">The forms.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Form/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationDonationsSetupForm } })]
        public JsonResult SaveForm([FromBody] InstitutionSettings.Form form)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(null, null, 0,
                    _institutionSettingService.SaveForm(form, Account.PersonId)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Form

        #region Global Settings

        /// <summary>
        /// Get currency format for the specific id
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/Subcultures/{id}/CurrencyFormat")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupSystemFormats } })]
        public JsonResult CurrencyFormats(string id)
        {
            try
            {
                const decimal positiveValue = (decimal)12345.67;
                const decimal negativeValue = (decimal)-12345.67;
                CurrencyFormatModel currency = new();
                CultureInfo idCulture = CultureInfo.GetCultureInfo(id);
                try
                {
                    RegionInfo regionInfo = new(idCulture.Name);
                    currency.SymbolDescription = $"{regionInfo.ISOCurrencySymbol} - {regionInfo.CurrencyEnglishName}";
                }
                catch
                {
                    currency.SymbolDescription = string.Empty;
                }
                currency.DecimalDigits = idCulture.NumberFormat.CurrencyDecimalDigits;
                currency.DecimalSeparator = idCulture.NumberFormat.CurrencyDecimalSeparator;
                currency.Symbol = idCulture.NumberFormat.CurrencySymbol;
                currency.GroupSeparator = idCulture.NumberFormat.CurrencyGroupSeparator;
                currency.PositivePattern = positiveValue.ToString("C", idCulture);
                currency.NegativePattern = negativeValue.ToString("C", idCulture);
                return Json(SerializationHelper.ToJsonResult(new { currency }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get date and time formats for the specific id.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/Subcultures/{id}/DateTimeFormat")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupSystemFormats } })]
        public JsonResult DateTimeFormats(string id)
        {
            try
            {
                DateTime now = DateTime.Now;
                DateTimeFormatModel dateFormat = new();
                CultureInfo idCulture = CultureInfo.GetCultureInfo(id);
                DateTimeFormatInfo dateTimeInfo = idCulture.DateTimeFormat;

                //Time
                dateFormat.ShortTimePattern = dateTimeInfo.ShortTimePattern;
                dateFormat.LongTimePattern = dateTimeInfo.LongTimePattern;
                dateFormat.ShortTimeExample = now.ToString(dateTimeInfo.ShortTimePattern, dateTimeInfo);
                dateFormat.LongTimeExample = now.ToString(dateTimeInfo.LongTimePattern, dateTimeInfo);
                dateFormat.AMDesignator = dateTimeInfo.AMDesignator;
                dateFormat.PMDesignator = dateTimeInfo.PMDesignator;

                //date
                dateFormat.ShortDatePattern = dateTimeInfo.ShortDatePattern;
                dateFormat.LongDatePattern = dateTimeInfo.LongDatePattern;
                dateFormat.ShortDateExample = now.ToString(dateTimeInfo.ShortDatePattern, dateTimeInfo);
                dateFormat.LongDateExample = now.ToString(dateTimeInfo.LongDatePattern, dateTimeInfo);
                dateFormat.FirstDayOfWeek = dateTimeInfo.GetDayName(dateTimeInfo.FirstDayOfWeek);

                return Json(SerializationHelper.ToJsonResult(new { dateFormat }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Emails the reg exp.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/EmailRegExp")]
        [AllowAnonymous]
        public JsonResult EmailRegExp()
        {
            try
            {
                string emailRegExp = _settingService.GetEmailTypeRegexExpression();
                return Json(SerializationHelper.ToJsonResult(emailRegExp));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get general settings
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("Settings/General")]
        public JsonResult General()
        {
            try
            {
                //General
                General general = _institutionSettingService.GetGeneral();
                //UILanguages
                string json = string.Empty;
                const string UICultureJson = @"Resources\General\UICulture.json";
                string path = Path.Combine(_environment.ContentRootPath, UICultureJson);
                using (StreamReader reader = new(path))
                    json = reader.ReadToEnd();
                List<ListOptionViewModel> languageList = SerializationHelper.ToObject<List<ListOptionViewModel>>(json);
                //AllowedParentCultues
                string[] allowedParentCultures = general.AllowedParentCultures;
                List<ListOptionViewModel> cultureInfoList = new();
                ListOptionViewModel cultureInfo = null;
                CultureInfo[] cinfo = CultureInfo.GetCultures(CultureTypes.NeutralCultures).Where(c => allowedParentCultures.Contains(c.Name)).ToArray();
                foreach (CultureInfo cul in cinfo.OrderBy(x => x.DisplayName))
                {
                    cultureInfo = new ListOptionViewModel
                    {
                        Value = cul.Name,
                        Description = cul.DisplayName
                    };
                    cultureInfoList.Add(cultureInfo);
                }
                return Json(SerializationHelper.ToJsonResult(new { general, languageList, cultureInfoList }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Numbers the formats.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/Subcultures/{id}/NumberFormat")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupSystemFormats } })]
        public JsonResult NumberFormats(string id)
        {
            try
            {
                NumberFormatModel numberFormat = new();
                CultureInfo idCulture = CultureInfo.GetCultureInfo(id);
                NumberFormatInfo numberFormatInfo = idCulture.NumberFormat;
                numberFormat.NumberDecimalSeparator = numberFormatInfo.NumberDecimalSeparator;
                numberFormat.NumberDecimalDigits = numberFormatInfo.NumberDecimalDigits;
                numberFormat.NumberGroupSeparator = numberFormatInfo.NumberGroupSeparator;
                numberFormat.DigitGrouping = (123456789).ToString("N", idCulture);
                numberFormat.NegativeSign = numberFormatInfo.NegativeSign;
                numberFormat.NegativeNumberFormat = (-1.1).ToString("N", idCulture);
                numberFormat.DisplayLeadingZeros = (0.7).ToString("N", idCulture);
                numberFormat.ListSeparator = idCulture.TextInfo.ListSeparator;
                return Json(SerializationHelper.ToJsonResult(new { numberFormat }));
            }
            catch (Exception ex)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, ex.Message, ex);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the general.
        /// </summary>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/General")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupSystemFormats } })]
        public JsonResult SaveGeneral([FromBody] General general)
        {
            try
            {
                string language = _settingHelper.GetLanguage(Account);
                GlobalSettingsResources globalSettingsResources = _resourcesHelper.GetResourceType<GlobalSettingsResources>(language, new("Administration", "GlobalSettings"));
                if (!string.IsNullOrEmpty(general.PeopleIdFormat))
                {
                    if (!ValidationHelper.ValidateIdFormat(general.PeopleIdFormat))
                        return Json(SerializationHelper.ToJsonResult(null, globalSettingsResources.LblPeopleIdError, 0, false));
                }
                else
                {
                    general.PeopleIdFormat = string.Empty;
                }

                if (!string.IsNullOrEmpty(general.GovernmentIdFormat))
                {
                    int? maskLenght = _settingService.GetGovernmentIdMaxLength();
                    string error = string.Format(globalSettingsResources.LblGovernmentIdError, maskLenght);
                    if (!ValidationHelper.ValidateGovtIdFormat(general.GovernmentIdFormat, maskLenght))
                        return Json(SerializationHelper.ToJsonResult(null, error, 0, false));
                }
                else
                {
                    general.GovernmentIdFormat = string.Empty;
                }

                bool result = _institutionSettingService.SaveGeneral(general, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get settings cultures for the specific id
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupSystemFormats } })]
        public JsonResult Subcultures(string id)
        {
            try
            {
                List<ListOptionViewModel> listOptionViewModel = new();
                ListOptionViewModel cultureInfo = null;
                CultureInfo idCulture = CultureInfo.GetCultureInfo(id);
                var cultureInfoList = CultureInfo.GetCultures(CultureTypes.AllCultures).Select(x => new { Parent = x.Parent.Name, x.Name, x.DisplayName }).Where(x => x.Parent == idCulture.Name);
                foreach (var cul in cultureInfoList.OrderBy(x => x.DisplayName))
                {
                    cultureInfo = new ListOptionViewModel
                    {
                        Value = cul.Name,
                        Description = cul.DisplayName
                    };
                    listOptionViewModel.Add(cultureInfo);
                }
                return Json(SerializationHelper.ToJsonResult(new { listOptionViewModel }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Wildcard.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Settings/Wildcard")]
        public JsonResult Wildcard()
        {
            try
            {
                string wildcard = _settingService.GetWildcard();
                return Json(SerializationHelper.ToJsonResult(wildcard));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Global Settings

        #region Email Settings

        /// <summary>
        /// Emails this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Email")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupEmailProvider } })]
        public JsonResult Email()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetMail()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the email.
        /// </summary>
        /// <param name="mail">The mail.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Email/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupEmailProvider } })]
        public JsonResult SaveEmail([FromBody] Mail mail)
        {
            try
            {
                bool result = false;
                if (!string.IsNullOrEmpty(mail.StudentUrl)
                    && mail.StudentUrl.Trim() != string.Empty
                    && !string.IsNullOrEmpty(mail.StudentSeparator)
                    && mail.StudentSeparator.Trim() != string.Empty)
                {
                    mail.StaffUrl ??= string.Empty;
                    mail.StaffSeparator ??= string.Empty;
                    mail.Email ??= string.Empty;
                    result = _institutionSettingService.SaveMail(mail, Account.PersonId);
                }

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Staffs the email.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/StaffEmail")]
        public JsonResult StaffEmail()
        {
            try
            {
                Mail mail = _institutionSettingService.GetMail();
                return Json(SerializationHelper.ToJsonResult(new EmailSettingsViewModel
                {
                    CanEditRecipient = mail.CanEditRecipient,
                    CanEditSender = mail.CanEditSender,
                    Email = mail.Email,
                    EmailProvider = mail.EmailProvider,
                    Sender = mail.Sender,
                    StaffSeparator = mail.StaffSeparator,
                    StaffUrl = mail.StaffUrl,
                    StudentSeparator = mail.StudentSeparator,
                    StudentUrl = mail.StudentUrl
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Email Settings

        #region Payment Settings

        /// <summary>
        /// Payments this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Payment")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupPaymentProvider } })]
        public JsonResult Payment()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetPayment()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the theme.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Payment/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupPaymentProvider } })]
        public JsonResult SavePayment([FromBody] Payment payment)
        {
            try
            {
                bool result = false;
                if (((!string.IsNullOrEmpty(payment.Registration)
                    && payment.Registration.Trim() != string.Empty)
                    || GetPaymentValidation(true, PaymentOrigin.Registration))
                    && ((!string.IsNullOrEmpty(payment.Balance)
                    && payment.Balance.Trim() != string.Empty)
                    || GetPaymentValidation(true, PaymentOrigin.MakePayment))
                    && ((!string.IsNullOrEmpty(payment.TranscriptRequest)
                    && payment.TranscriptRequest.Trim() != string.Empty)
                    || GetPaymentValidation(true, PaymentOrigin.TranscriptRequest)))
                {
                    result = _institutionSettingService.SavePayment(payment, Account.PersonId);
                }

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (System.Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Validates the payment.
        /// </summary>
        /// <param name="paymentValidateModel">The payment validate model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Payment/Validate")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationWebsiteSetupPaymentProvider,
            ClaimsConstants.AdministrationStudentSetupTraditionalRegistration,
            ClaimsConstants.AdministrationStudentSetupFinancialSettings
         }, true })]
        public JsonResult ValidatePayment([FromBody] PaymentValidateModel paymentValidateModel)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(GetPaymentValidation(paymentValidateModel.FromPayment, paymentValidateModel.PaymentOrigin)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Payment Settings

        #region PhoneNumber

        /// <summary>
        /// Phones the number.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/PhoneNumber")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationProfileSetupPhoneNumber } })]
        public JsonResult PhoneNumber()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetPhoneNumber()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the phone number.
        /// </summary>
        /// <param name="phoneNumber">The phone number.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/PhoneNumber/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationProfileSetupPhoneNumber } })]
        public JsonResult SavePhoneNumber([FromBody] InstitutionSettings.PhoneNumber phoneNumber)
        {
            try
            {
                bool result = _institutionSettingService.SavePhoneNumber(phoneNumber, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion PhoneNumber

        #region Traditional Registration

        /// <summary>
        /// Get registration settings
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/Registration")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupTraditionalRegistration } })]
        public JsonResult Registration()
        {
            try
            {
                List<ListOptionViewModel> cashReceiptCodes = _codeTableService.GetCashReceiptCodes().ToViewModel(true);
                List<ListOptionViewModel> cashReceiptOffices = _codeTableService.GetByName(CodeTableName.Office, true).ToViewModel(true);
                List<ListOptionViewModel> agreements = _agreementService.GetPublished(AgreementType.Registration).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    settings = _institutionSettingService.GetRegistration(),
                    agreements,
                    cashReceiptCodes,
                    cashReceiptOffices
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the registration.
        /// </summary>
        /// <param name="registration">The registration.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Registration")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupTraditionalRegistration } })]
        public JsonResult SaveRegistration([FromBody] InstitutionSettings.Registration registration)
        {
            try
            {
                bool result = false;
                if (!registration.EnableOnlinePayment
                    || (GetPaymentValidation(false, PaymentOrigin.Registration)
                    && registration.CashReceiptCode > 0
                    && registration.CashReceiptOffice > 0))
                {
                    result = _institutionSettingService.SaveRegistration(registration, Account.PersonId);
                }

                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Traditional Registration

        #region Theme Settings

        /// <summary>
        /// Saves the theme.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupThemeEditor } })]
        public JsonResult SaveTheme([FromBody] Theme theme)
        {
            try
            {
                bool result = _institutionSettingService.SaveTheme(theme, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Themes the action colors.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupThemeEditor } })]
        public JsonResult ThemeActionColors()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetThemeActionColors()));
            }
            catch (System.Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Theme Settings

        #region Shared Access

        /// <summary>
        /// Saves the shared access.
        /// </summary>
        /// <param name="sharedAccess">The shared access.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/SharedAccess")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSharedAccess } })]
        public JsonResult SaveSharedAccess([FromBody] SharedAccess sharedAccess)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(null, null, 0,
                    _institutionSettingService.SaveSharedAccess(sharedAccess, Account.PersonId)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Shareds the access.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/SharedAccess")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupSharedAccess } })]
        public JsonResult SharedAccess()
        {
            try
            {
                List<ListOptionViewModel> emailTypes = _codeTableService.GetByName(CodeTableName.EmailType, true).ToViewModel(true);
                SharedAccess settings = _institutionSettingService.GetSharedAccess();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    settings,
                    emailTypes,
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Shared Access

        #region Student Records

        /// <summary>
        /// Saves the transcript.
        /// </summary>
        /// <param name="transcript">The transcript.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Transcript")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupStudentRecords } })]
        public JsonResult SaveTranscript([FromBody] StudentRecords transcript)
        {
            try
            {
                transcript.Legend = WebUtility.HtmlEncode(transcript.Legend);
                return Json(SerializationHelper.ToJsonResult(null, null, 0,
                    _institutionSettingService.SaveTranscript(transcript, Account.PersonId)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get Transcript settings.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/Transcript")]
        public JsonResult Transcript()
        {
            try
            {
                StudentRecords transcript = _institutionSettingService.GetStudentRecords();
                transcript.Legend = WebUtility.HtmlDecode(transcript.Legend);
                return Json(SerializationHelper.ToJsonResult(transcript));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Student Records

        #region Website Setup

        /// <summary>
        /// Get the System Information
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/SystemInformation")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupSystemInformation } })]
        public JsonResult SystemInformation()
        {
            try
            {
                string packageJson = _resourcesHelper.ReadJson(_environment.ContentRootPath, "package");
                NodePackageManagerViewModel nodePackageManagerViewModel = SerializationHelper.ToObject<NodePackageManagerViewModel>(packageJson);
                General generalSettings = _institutionSettingService.GetGeneral();
                BuildInformation buildInfo = _settingHelper.GetBuildInfo();
                return Json(SerializationHelper.ToJsonResult(nodePackageManagerViewModel.ToViewModel(buildInfo, generalSettings, _connectionStrings)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Website Setup

        #region Settings Filter

        /// <summary>
        /// Get registration settings
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Filter")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationProfileSetupAddress,
            ClaimsConstants.AdministrationProfileSetupPhoneNumber,
         }})]
        public JsonResult InstitutionSettingFilter([FromBody] InstitutionSettingFilterType filter)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingFilterService.Get(filter)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Creates the specified institution setting filter.
        /// </summary>
        /// <param name="institutionSettingFilterModel">The institution setting filter model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Filter/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationProfileSetupAddress,
            ClaimsConstants.AdministrationProfileSetupPhoneNumber
         }})]
        public JsonResult Save([FromBody] InstitutionSettingFilterModel institutionSettingFilterModel)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(null, null, 0,
                    _institutionSettingFilterService.Save(institutionSettingFilterModel.Adds,
                    Account.PersonId, institutionSettingFilterModel.Filter)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Settings Filter

        #region Advisor Warnings

        /// <summary>
        /// Advisors the warnings.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Settings/AdvisorWarnings")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationInstructorSetupAdvisorWarnings } })]
        public JsonResult AdvisorWarnings()
        {
            try
            {
                Period currentPeriod = _periodService.GetCurrent();
                List<GradeValue> grades = _gradesService.Get(currentPeriod.Year, currentPeriod.TermCode);
                List<InstitutionSettingFilter> violations = _institutionSettingFilterService.Get(InstitutionSettingFilterType.Violation);
                AdvisorWarning advisorWarning = _institutionSettingService.GetAdvisorWarnings();
                return Json(SerializationHelper.ToJsonResult(advisorWarning.ToViewModel(grades, violations)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the advisor warnings.
        /// </summary>
        /// <param name="advisorWarningModel">The advisor warning model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/AdvisorWarnings")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationInstructorSetupAdvisorWarnings } })]
        public JsonResult SaveAdvisorWarnings([FromBody] AdvisorWarningModel advisorWarningModel)
        {
            try
            {
                bool resultAttendance = false;
                bool resultViolations = false;
                bool resultGrades = false;
                if (advisorWarningModel != null)
                {
                    resultAttendance = _institutionSettingService.SaveAdvisorWarning(ToAdvisorWarning(advisorWarningModel), Account.PersonId);

                    List<string> selected = new();
                    advisorWarningModel.SelectedGrades?.ForEach(grade => selected.Add(grade.ToString()));
                    resultViolations = _institutionSettingFilterService.Save(selected, Account.PersonId, 2);

                    selected = new List<string>();
                    advisorWarningModel.SelectedViolations?.ForEach(violation => selected.Add(violation.ToString()));
                    resultGrades = _institutionSettingFilterService.Save(selected, Account.PersonId, 3);
                }
                return Json(SerializationHelper.ToJsonResult(resultAttendance && resultViolations && resultGrades));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Advisor Warnings

        #region Address

        /// <summary>
        /// Get address settings
        /// </summary>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Settings/Address")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationProfileSetupAddress } })]
        public JsonResult Address()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetAddress()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the address setings.
        /// </summary>
        /// <param name="address">The address.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Settings/Address/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationProfileSetupAddress } })]
        public JsonResult SaveAddress([FromBody] InstitutionSettings.Address address)
        {
            try
            {
                bool result = _institutionSettingService.SaveAddress(address, Account.PersonId, _addressRequestService);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Address

        #region PreferredName

        /// <summary>
        /// Get address settings
        /// </summary>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Settings/PreferredName")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationProfileSetupPreferredName } })]
        public JsonResult PreferredName()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetPreferredName()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the address setings.
        /// </summary>
        /// <param name="address">The address.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Settings/PreferredName/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationProfileSetupPreferredName } })]
        public JsonResult SavePreferredName([FromBody] PreferredNameArea preferredName)
        {
            try
            {
                bool result = _institutionSettingService.SavePreferredName(preferredName, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion PreferredName

        #region NameFormatExamples

        /// <summary>
        /// Get address settings
        /// </summary>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Settings/NameFormat")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupNameFormats } })]
        public JsonResult NameFormat()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetNameFormat()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the name format.
        /// </summary>
        /// <param name="nameFormat">The name format.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/NameFormat/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupNameFormats } })]
        public JsonResult SaveNameFormat([FromBody] string nameFormatExamples)
        {
            try
            {
                InstitutionSettings.NameFormat nameFormat = new()
                {
                    Examples = nameFormatExamples
                };
                bool result = _institutionSettingService.SaveNameFormat(nameFormat, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion NameFormatExamples

        #region ReCaptcha

        /// <summary>
        /// Settings for ReCaptcha.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/ReCaptcha")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupReCaptcha } })]
        public JsonResult ReCaptcha()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetReCaptcha()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the settings for ReCaptcha.
        /// </summary>
        /// <param name="reCaptcha">The re captcha.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/ReCaptcha/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupReCaptcha } })]
        public JsonResult SaveReCaptcha([FromBody] InstitutionSettings.ReCaptcha reCaptcha)
        {
            try
            {
                bool result = _institutionSettingService.SaveReCaptcha(reCaptcha, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion ReCaptcha

        #region CourseMaterials
        /// <summary>
        /// Course materials this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/CourseMaterials")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupCourseMaterials } })]
        public JsonResult CourseMaterials()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetCourseMaterials()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
        /// <summary>
        /// Save course materials settings.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/CourseMaterials/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationWebsiteSetupCourseMaterials } })]
        public JsonResult SaveCourseMaterials([FromBody] CourseMaterials courseMaterials)
        {
            try
            {
                bool result = _institutionSettingService.SaveCourseMaterials(courseMaterials, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
        #endregion CourseMaterials

        #region Application

        /// <summary>
        /// Applications this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Application")]
        public JsonResult Application()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetApplication()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the application.
        /// </summary>
        /// <param name="applicationSettings">The application settings.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/Application/Save")]
        public JsonResult SaveApplication([FromBody] InstitutionSettings.Application applicationSettings)
        {
            try
            {
                bool result = _institutionSettingService.SaveApplication(applicationSettings, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Application

        #region ApplicationStatus

        /// <summary>
        /// Applications the status.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/ApplicationStatus")]
        public JsonResult ApplicationStatus()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_institutionSettingService.GetApplicationStatus()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the application.
        /// </summary>
        /// <param name="applicationSettings">The application settings.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Settings/ApplicationStatus/Save")]
        public JsonResult SaveApplicationStatus([FromBody] InstitutionSettings.ApplicationStatus applicationStatusSettings)
        {
            try
            {
                bool result = _institutionSettingService.SaveApplicationStatus(applicationStatusSettings, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion ApplicationStatus

        #region Transcript Request

        /// <summary>
        /// Saves the transcript request.
        /// </summary>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Settings/TranscriptRequest/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupTranscriptRequest } })]
        public JsonResult SaveTranscriptRequest([FromBody] TranscriptRequest transcriptRequest)
        {
            try
            {
                bool result = false;
                if (!transcriptRequest.EnableOnlinePayment
                    || (GetPaymentValidation(false, PaymentOrigin.TranscriptRequest)
                    && transcriptRequest.CashReceiptCode > 0
                    && transcriptRequest.CashReceiptOffice > 0))
                {
                    result = _institutionSettingService.SaveTranscriptRequest(transcriptRequest, Account.PersonId);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the Transcript request.
        /// </summary>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Settings/TranscriptRequest")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationStudentSetupTranscriptRequest } })]
        public JsonResult TranscriptRequest()
        {
            try
            {
                List<ListOptionViewModel> cashReceiptCodes = _codeTableService.GetCashReceiptCodes().ToViewModel(true);
                List<ListOptionViewModel> cashReceiptOffices = _codeTableService.GetByName(CodeTableName.Office, true).ToViewModel(true);
                List<ListOptionViewModel> chargeCreditCodes = _codeTableService.GetChargeCreditCodes().ToViewModel(true);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    settings = _institutionSettingService.GetTranscriptRequest(),
                    cashReceiptCodes,
                    cashReceiptOffices,
                    chargeCreditCodes
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SettingsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Transcript Request

        #region Private Methods

        /// <summary>
        /// Gets the payment vaidation.
        /// </summary>
        /// <param name="fromPayment">if set to <c>true</c> [from payment].</param>
        /// <param name="paymentOrigin">The payment origin.</param>
        /// <returns></returns>
        private bool GetPaymentValidation(bool fromPayment, PaymentOrigin paymentOrigin)
        {
            bool result = false;
            if (fromPayment)
            {
                switch (paymentOrigin)
                {
                    case PaymentOrigin.Registration:
                        Registration registration = _institutionSettingService.GetRegistration();
                        result = !registration.EnableOnlinePayment;
                        break;

                    case PaymentOrigin.MakePayment:
                        Financial financial = _institutionSettingService.GetFinancial();
                        result = !financial.EnableOnlinePayment;
                        break;

                    case PaymentOrigin.TranscriptRequest:
                        TranscriptRequest transcriptRequest = _institutionSettingService.GetTranscriptRequest();
                        result = !transcriptRequest.EnableOnlinePayment;
                        break;

                    case PaymentOrigin.ConEdRegistration:
                        ConEdRegistration conEdRegistration = _institutionSettingService.GetConEdRegistration();
                        result = !conEdRegistration.EnableOnlinePayment;
                        break;
                }
            }
            else
            {
                Payment payment = _institutionSettingService.GetPayment();
                switch (paymentOrigin)
                {
                    case PaymentOrigin.Registration:
                        result = !string.IsNullOrEmpty(payment.Registration);
                        break;

                    case PaymentOrigin.MakePayment:
                        result = !string.IsNullOrEmpty(payment.Balance);
                        break;

                    case PaymentOrigin.TranscriptRequest:
                        result = !string.IsNullOrEmpty(payment.TranscriptRequest);
                        break;

                    case PaymentOrigin.ConEdRegistration:
                        result = !string.IsNullOrEmpty(payment.ConEdRegistration);
                        break;
                }
            }
            return result;
        }

        /// <summary>
        /// To the advisor warning.
        /// </summary>
        /// <param name="advisorWarningModel">The advisor warning model.</param>
        /// <returns></returns>
        private AdvisorWarning ToAdvisorWarning(AdvisorWarningModel advisorWarningModel)
        {
            return new AdvisorWarning
            {
                ExcusedAbsences = advisorWarningModel.ExcusedAbsences,
                ExcusedTardiness = advisorWarningModel.ExcusedTardiness,
                ShowAttendance = advisorWarningModel.ShowAttendance,
                ShowGrades = advisorWarningModel.ShowGrades,
                ShowViolations = advisorWarningModel.ShowViolations,
                UnexcusedAbsences = advisorWarningModel.UnexcusedAbsences,
                UnexcusedTardiness = advisorWarningModel.UnexcusedTardiness
            };
        }

        #endregion Private Methods
    }
}