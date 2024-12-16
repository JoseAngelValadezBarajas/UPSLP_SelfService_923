// --------------------------------------------------------------------
// <copyright file="DonationsController.cs" company="Ellucian">
//     Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Mappers;
using SelfService.Models.Session;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// DonationsController
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class DonationsController : BaseEndpointController
    {
        /// <summary>
        /// The code table head service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

        /// <summary>
        /// The donation service
        /// </summary>
        private readonly IDonationService _donationService;

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
        private readonly IAppLogger<DonationsController> _logger;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// Initializes a new instance of the <see cref="DonationsController"/> class.
        /// </summary>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="donationService">The donation service.</param>
        /// <param name="institutionSettingFilterService">The institution setting filter service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public DonationsController(
            ICodeTableService codeTableService,
            IDonationService donationService,
            IInstitutionSettingFilterService institutionSettingFilterService,
            IInstitutionSettingService institutionSettingService,
            IPeopleService peopleService,
            ISerializationHelper serializationHelper,
            IAppLogger<DonationsController> logger)
            : base(serializationHelper)
        {
            _codeTableService = codeTableService;
            _donationService = donationService;
            _institutionSettingFilterService = institutionSettingFilterService;
            _institutionSettingService = institutionSettingService;
            _peopleService = peopleService;

            _logger = logger;
        }

        #region Campaign

        /// <summary>
        /// Indexes this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Donations")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationDonationsSetupCampaigns } })]
        public JsonResult Index()
        {
            try
            {
                bool hasPaymentUrl = !string.IsNullOrEmpty(_institutionSettingService.GetPayment().Donations);
                List<ListOptionViewModel> pcCampaigns = _donationService.GetAllCampaigns().ToViewModel();
                List<InstitutionSettingFilter> campaigns = _institutionSettingFilterService.Get(InstitutionSettingFilterType.Campaign);
                return Json(SerializationHelper.ToJsonResult(new { pcCampaigns, campaigns, hasPaymentUrl }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DonationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Campaign

        #region Form

        /// <summary>
        /// Optionses this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationDonationsSetupGiftBatchDefaults } })]
        [Route("Donations/Form/Options")]
        public JsonResult FormOptions()
        {
            try
            {
                List<ListOptionViewModel> emailTypes = _codeTableService.GetByName(CodeTableName.EmailType).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    emailTypes
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DonationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Form

        #region GiftBatch

        /// <summary>
        /// Optionses this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Donations/Options")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationDonationsSetupGiftBatchDefaults } })]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Options()
        {
            try
            {
                List<ListOptionViewModel> acknowledgePrints = _codeTableService.GetByName(CodeTableName.AcknowledgePrint).ToViewModel();
                List<ListOptionViewModel> acknowledgeResponsibles = _codeTableService.GetByName(CodeTableName.Solicitor).ToViewModel();
                List<ListOptionViewModel> acknowledgeTypes = _codeTableService.GetByName(CodeTableName.AcknowledgeType).ToViewModel();
                List<ListOptionViewModel> allocations = _codeTableService.GetByName(CodeTableName.GiftAllocation).ToViewModel();
                List<ListOptionViewModel> appeals = _codeTableService.GetByName(CodeTableName.GiftAppeal).ToViewModel();
                List<ListOptionViewModel> campaigns = _donationService.GetAllCampaigns().ToViewModel();
                List<ListOptionViewModel> giftTypes = _codeTableService.GetByName(CodeTableName.GiftType).ToViewModel();
                List<ListOptionViewModel> methodHows = _codeTableService.GetByName(CodeTableName.MethodHow).ToViewModel();
                List<ListOptionViewModel> methodWhens = _codeTableService.GetByName(CodeTableName.MethodWhen).ToViewModel();
                List<ListOptionViewModel> methodWhos = _codeTableService.GetByName(CodeTableName.MethodWho).ToViewModel();
                List<ListOptionViewModel> offices = _codeTableService.GetByName(CodeTableName.Office).ToViewModel();
                List<ListOptionViewModel> operators = _peopleService.GetGiftBatchOwners().ToOptionViewModel(CurrentNameFormat, CurrentNameSort, ShowMiddleNameInitial);
                List<ListOptionViewModel> programs = _codeTableService.GetByName(CodeTableName.GiftProgram).ToViewModel();
                List<ListOptionViewModel> projects = _codeTableService.GetProjects().ToViewModel();
                List<ListOptionViewModel> receiptPrints = _codeTableService.GetByName(CodeTableName.ReceiptPrint).ToViewModel();
                List<ListOptionViewModel> solicitors = _codeTableService.GetByName(CodeTableName.Solicitor).ToViewModel();
                List<ListOptionViewModel> solicitorMethods = _codeTableService.GetByName(CodeTableName.SolicitorMethod).ToViewModel();
                List<ListOptionViewModel> sources = _codeTableService.GetByName(CodeTableName.GiftSource).ToViewModel();
                List<ListOptionViewModel> tenders = _codeTableService.GetByName(CodeTableName.GiftTender).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    acknowledgePrints,
                    acknowledgeResponsibles,
                    acknowledgeTypes,
                    allocations,
                    appeals,
                    campaigns,
                    giftTypes,
                    methodHows,
                    methodWhens,
                    methodWhos,
                    offices,
                    operators,
                    programs,
                    projects,
                    receiptPrints,
                    solicitors,
                    solicitorMethods,
                    sources,
                    tenders
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DonationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion GiftBatch

        #region Make a Gift
        /// <summary>
        /// Gets the ReCaptcha settings for donations.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Donations/RecaptchaSettings")]
        [AllowAnonymous]
        public JsonResult GetRecaptchaSettings()
        {
            try
            {
                bool isReCaptchaMakePaymentEnabled = false;
                string reCaptchaSiteKey = string.Empty;

                InstitutionSettings.ReCaptcha reCaptchaSettings = _institutionSettingService.GetReCaptcha();
                isReCaptchaMakePaymentEnabled = reCaptchaSettings.EnableMakePayment;
                reCaptchaSiteKey = reCaptchaSettings.SiteKey;

                return Json(SerializationHelper.ToJsonResult(new
                {
                    isReCaptchaMakePaymentEnabled,
                    reCaptchaSiteKey
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DonationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }


        /// <summary>
        /// Cancels this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Donations/PersonalInfo/Cancel")]
        public JsonResult Cancel()
        {
            try
            {
                bool result = false;
                if (HttpContext.Session.GetObject<Account>(Constants._accountSession) != null)
                {
                    HttpContext.Session.Remove(Constants._accountSession);
                    Account = null;
                    result = true;
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DonationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gifts this instance.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Donations/Gift")]
        [AllowAnonymous]
        public JsonResult Gift()
        {
            try
            {
                bool hasPaymentUrl = !string.IsNullOrEmpty(_institutionSettingService.GetPayment().Donations);
                List<ListOptionViewModel> campaigns = _donationService.GetDonationCampaigns().ToViewModel();
                InstitutionSettings.Donation donation = _institutionSettingService.GetDonation();
                bool hasGiftBatch = donation.Operator > 0 && donation.Office > 0 && !string.IsNullOrEmpty(donation.Description)
                    && donation.Project > 0 && donation.Campaign > 0 && donation.Solicitor > 0 && donation.ReceiptPrint > 0;
                bool hasEmailType = _institutionSettingService.GetForm().EmailType > 0;
                bool isAuthenticated = Account != null;
                int defaultCampaign = donation.Campaign;
                return Json(SerializationHelper.ToJsonResult(new { campaigns, hasPaymentUrl, hasGiftBatch, isAuthenticated, defaultCampaign, hasEmailType }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DonationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the donor.
        /// </summary>
        /// <param name="personalInfo">The personal information.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("Donations/PersonalInfo")]
        public JsonResult PersonalInfo([FromBody] PersonalInfo personalInfo)
        {
            try
            {
                bool result = false;
                int personId = 0;
                if (personalInfo.Address != null && personalInfo.People != null && personalInfo.Phones != null)
                    personId = _donationService.SaveDonorInfo(personalInfo);
                if (personId > 0)
                {
                    result = true;
                    Account = new Account
                    {
                        DisplayName = personalInfo.People?.DisplayName,
                        Email = personalInfo.People?.Email,
                        PeopleCodeId = string.Empty,
                        PeopleId = string.Empty,
                        PersonId = personId,
                        TemporaryEmail = string.Empty,
                        TemporaryUserId = -1,
                        UserName = string.Empty
                    };
                    HttpContext.Session.SetObject(Constants._accountSession, Account);
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DonationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Personals the information options.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Donations/PersonalInfo/Options")]
        [AllowAnonymous]
        public JsonResult PersonalInfoOptions()
        {
            try
            {
                List<ListOptionViewModel> addressTypes = _codeTableService.GetByName(CodeTableName.AddressType).ToViewModel();
                List<ListOptionViewModel> counties = _codeTableService.GetByName(CodeTableName.County).ToViewModel();
                List<ListOptionViewModel> countries = _codeTableService.GetByName(CodeTableName.Country).ToViewModel();
                List<ListOptionViewModel> countryFormatPhones = _codeTableService.GetAllCountries().ToViewModel();
                List<ListOptionViewModel> phoneTypes = _codeTableService.GetPhoneTypes().ToViewModel(false);
                List<ListOptionViewModel> prefixes = _codeTableService.GetByName(CodeTableName.Prefix).ToViewModel();
                List<ListOptionViewModel> states = _codeTableService.GetByName(CodeTableName.State).ToViewModel();
                List<ListOptionViewModel> suffixes = _codeTableService.GetByName(CodeTableName.Suffix).ToViewModel();

                return Json(SerializationHelper.ToJsonResult(new
                {
                    addressTypes,
                    counties,
                    countries,
                    countryFormatPhones,
                    phoneTypes,
                    prefixes,
                    states,
                    suffixes
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DonationsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        #endregion Make a Gift
    }
}