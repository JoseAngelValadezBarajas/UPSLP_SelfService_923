// --------------------------------------------------------------------
// <copyright file="PeopleController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Account;
using SelfService.Models.Account.MyProfile;
using SelfService.Models.Shared;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /People route
    /// </summary>
    /// <seealso cref="SelfService.Controllers.Endpoints.BaseEndpointController" />
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class PeopleController : BaseEndpointController
    {
        /// <summary>
        /// The agreement service
        /// </summary>
        private readonly IAgreementService _agreementService;

        /// <summary>
        /// The code table service
        /// </summary>
        private readonly ICodeTableService _codeTableService;

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
        private readonly IAppLogger<PeopleController> _logger;

        /// <summary>
        /// The name format service
        /// </summary>
        private readonly INameFormatService _nameFormatService;

        /// <summary>
        /// The notifications helper
        /// </summary>
        private readonly INotificationsHelper _notificationsHelper;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The period service
        /// </summary>
        private readonly IPeriodService _periodService;

        /// <summary>
        /// The picture helper
        /// </summary>
        private readonly IPictureHelper _pictureHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="PeopleController"/> class.
        /// </summary>
        /// <param name="agreementService">The agreement service.</param>
        /// <param name="codeTableService">The code table service.</param>
        /// <param name="institutionSettingFilterService">The institution setting filter service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="nameFormatService">The name format service.</param>
        /// <param name="notificationsHelper">The notifications helper.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="periodService">The period service.</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public PeopleController(
            IAgreementService agreementService,
            ICodeTableService codeTableService,
            IInstitutionSettingFilterService institutionSettingFilterService,
            IInstitutionSettingService institutionSettingService,
            INameFormatService nameFormatService,
            INotificationsHelper notificationsHelper,
            IPeopleService peopleService,
            IPeriodService periodService,
            IPictureHelper pictureHelper,
            ISerializationHelper serializationHelper,
            IAppLogger<PeopleController> logger)
            : base(serializationHelper)
        {
            _agreementService = agreementService;
            _codeTableService = codeTableService;
            _institutionSettingFilterService = institutionSettingFilterService;
            _institutionSettingService = institutionSettingService;
            _nameFormatService = nameFormatService;
            _notificationsHelper = notificationsHelper;
            _peopleService = peopleService;
            _periodService = periodService;
            _pictureHelper = pictureHelper;

            _logger = logger;
        }

        #region Agreements

        /// <summary>
        /// Agreements the detail.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("People/AgreementDetail")]
        public JsonResult AgreementDetail([FromBody] int id)
        {
            try
            {
                if (id <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "The People Agreement id is less than or equal to zero", 0, false));
                AgreementDetail agreementDetail = _peopleService.GetAgreement(id);
                return Json(SerializationHelper.ToJsonResult(agreementDetail.ToViewModel()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Agreements the specified people model.
        /// </summary>
        /// <param name="model">The people model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("People/Agreements")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult Agreements([FromBody] PeopleModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                int startIndex = model.StartIndex.Value;
                int length = model.Length.Value;

                if (personId <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "The Person id is less than or equal to zero", 0, false));
                if (startIndex < 0)
                    return Json(SerializationHelper.ToJsonResult(null, "The StartIndex is less than zero", 0, false));
                if (length <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "The Length is less than or equal to zero", 0, false));
                PeopleAgreements peopleAgreements = _peopleService.GetAgreements(personId, startIndex, length);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(peopleAgreements.ToViewModel(general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the agreement.
        /// </summary>
        /// <param name="peopleAgreementModel">The people agreement model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("People/SaveAgreement")]
        public JsonResult SaveAgreement([FromBody] PeopleAgreementModel peopleAgreementModel)
        {
            try
            {
                int id = peopleAgreementModel.Id;
                int agreementId = peopleAgreementModel.AgreementId;
                bool isAccepted = peopleAgreementModel.IsAccepted;
                string yearTerm = peopleAgreementModel.YearTerm;
                int year;
                string term;
                if (string.IsNullOrEmpty(yearTerm))
                {
                    year = int.Parse(_periodService.GetCurrentYear());
                    term = _periodService.GetCurrentTerm();
                }
                else
                {
                    string[] yt = yearTerm.Split('/');
                    year = int.Parse(yt[0]);
                    term = yt[1];
                }
                PeopleAgreement peopleAgreement = new()
                {
                    PeopleAgreementId = id,
                    AcademicYear = year,
                    AcademicTerm = term,
                    IsAccepted = isAccepted,
                    PersonId = Account.PersonId,
                    Id = agreementId
                };
                int returnStatus = 0;
                if (peopleAgreement.PeopleAgreementId > 0)
                    returnStatus = _peopleService.UpdateAgreement(peopleAgreement);
                else
                {
                    returnStatus = _peopleService.CreateAgreement(peopleAgreement);
                    peopleAgreement.PeopleAgreementId = returnStatus > 0 ? returnStatus : 0;
                }
                // Send notification
                if (isAccepted)
                    _ = SendAgreementNotificationAsync(agreementId, year.ToString(), term);
                return Json(SerializationHelper.ToJsonResult(new { result = returnStatus > 0, id = peopleAgreement.PeopleAgreementId }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Agreements

        #region Demographic

        /// <summary>
        /// Endpoint to get the demographic information of a person.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("People/Demographic")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationRequestsSetupDemographic,
            ClaimsConstants.GeneralProfileDemographic  }, true })]
        public JsonResult Demographic([FromBody] int? personId)
        {
            try
            {
                Demographic demographic = new();
                if (personId.HasValue)
                    demographic = _peopleService.GetDemographic(personId.Value);
                else
                    demographic = _peopleService.GetDemographic(Account.PersonId);

                bool hasPending = demographic.DemographicPending != null;
                int demographicFormId = 0;
                if (hasPending)
                    demographicFormId = demographic.DemographicPending.DemographicFormId;

                List<ProfileDemographicViewModel> demographicViewModelList = demographic.ToViewModel(_institutionSettingService);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    demographicFormId,
                    hasPending,
                    _institutionSettingService.GetDemographic().AllowChange,
                    demographicViewModelList
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the demographic options
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("People/Demographic/Options")]
        public JsonResult DemographicOptions()
        {
            try
            {
                List<ListOptionViewModel> countries = _codeTableService.GetByName(CodeTableName.Country, true).ToViewModel();
                List<ListOptionViewModel> ethnicities = _codeTableService.GetByName(CodeTableName.Ethnicity, true).ToViewModel();
                List<ListOptionViewModel> genders = _codeTableService.GetByName(CodeTableName.Gender, true).ToViewModel();
                List<ListOptionViewModel> languages = _codeTableService.GetByName(CodeTableName.Language, true).ToViewModel();
                List<ListOptionViewModel> maritalStatus = _codeTableService.GetByName(CodeTableName.MaritalStatus, true).ToViewModel();
                List<ListOptionViewModel> religions = _codeTableService.GetByName(CodeTableName.Religion, true).ToViewModel();
                List<ListOptionViewModel> veteranStatus = _codeTableService.GetByName(CodeTableName.Veteran, true).ToViewModel();
                List<ListOptionViewModel> visas = _codeTableService.GetByName(CodeTableName.Visa, true).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    countries,
                    ethnicities,
                    genders,
                    languages,
                    maritalStatus,
                    religions,
                    veteranStatus,
                    visas
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the demographic.
        /// </summary>
        /// <param name="profileDemographicModel">The profile demographic model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("People/Demographic/Save")]
        public JsonResult SaveDemographic([FromBody] ProfileDemographicModel profileDemographicModel)
        {
            try
            {
                bool result = false;
                if (profileDemographicModel != null)
                {
                    Demographic demographic = new()
                    {
                        CitizenshipId = profileDemographicModel.CitizenshipId,
                        CountryOfBirthId = profileDemographicModel.CountryOfBirthId,
                        DemographicFormId = profileDemographicModel.DemographicFormId,
                        EthnicityId = profileDemographicModel.EthnicityId,
                        Gender = profileDemographicModel.GenderId,
                        IsRetired = profileDemographicModel.IsRetired,
                        LanguageId = profileDemographicModel.LanguageId,
                        MaritalStatusId = profileDemographicModel.MaritalStatusId,
                        MonthsInCountry = profileDemographicModel.MonthsInCountry,
                        ReligionId = profileDemographicModel.ReligionId,
                        SecondaryCitizenshipId = profileDemographicModel.SecondaryCitizenshipId,
                        SecondaryLanguageId = profileDemographicModel.SecondaryLanguageId,
                        VeteranId = profileDemographicModel.VeteranId,
                        VisaId = profileDemographicModel.VisaId
                    };
                    if (demographic == null)
                        return Json(SerializationHelper.ToJsonResult(null, "Demographic is not valid", 0, false));
                    if (DemographicIsValid(demographic))
                        result = _peopleService.SaveDemographic(Account.PersonId, _institutionSettingService.GetDemographic().RequireApproval, demographic);
                    else
                        _logger.LogError(Constants._product, typeof(PeopleController).FullName, "Demographic is not valid, required fields are missing.");
                }
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Demographic

        #region Ethnicity

        /// <summary>
        /// Endpoint to get the ethnicity of a person.
        /// </summary>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpGet]
        [Route("People/Ethnicity")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Ethnicity()
        {
            try
            {
                List<PersonIpedsFederalCategory> PersonIpedsFederalCategories = _peopleService.GetEthnicity(Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(PersonIpedsFederalCategories));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Endpoint to save the ethnicity of a person.
        /// </summary>
        /// <param name="ethnicities">The ethnicities.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("People/Ethnicity")]
        public JsonResult Ethnicity([FromBody] List<Ethnicity> ethnicities)
        {
            try
            {
                bool wasSaved = _peopleService.SaveEthnicities(Account.PersonId, ethnicities);
                return Json(SerializationHelper.ToJsonResult(wasSaved));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Ethnicity

        #region Gender Identity

        /// <summary>
        /// Endpoint to get the gender identity of a person.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("People/GenderIdentity")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationProfileSetupPreferredName,
            ClaimsConstants.AdministrationRequestsSetupPreferredName,
            ClaimsConstants.GeneralProfilePreferredName
         }, true })]
        public JsonResult GenderIdentity([FromBody] int? personId)
        {
            try
            {
                GenderIdentity genderIdentity = new();
                if (personId.HasValue)
                    genderIdentity = _peopleService.GetGenderIdentity(personId.Value);
                else
                    genderIdentity = _peopleService.GetGenderIdentity(Account.PersonId);
                genderIdentity.RequestId ??= 0;
                InstitutionSettings.PreferredNameArea settings = _institutionSettingService.GetPreferredName();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    genderIdentity,
                    settings
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Endpoint to get the gender identity options.
        /// </summary>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("People/GenderIdentity/Options")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationProfileSetupPreferredName,
            ClaimsConstants.GeneralProfilePreferredName
         }, true })]
        public JsonResult GenderIdentityOptions()
        {
            try
            {
                List<ListOptionViewModel> genderIdentities = _codeTableService.GetByName(CodeTableName.GenderIdentity, true).ToViewModel();
                List<ListOptionViewModel> pronouns = _codeTableService.GetByName(CodeTableName.Pronoun, true).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    genderIdentities,
                    pronouns
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the gender identity.
        /// </summary>
        /// <param name="genderIdentity">The gender identity.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("People/GenderIdentity/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationProfileSetupPreferredName,
            ClaimsConstants.GeneralProfilePreferredName
         }, true })]
        public JsonResult SaveGenderIdentity([FromBody] ProfileGenderIdentityModel genderIdentity)
        {
            try
            {
                if (genderIdentity == null)
                    return Json(SerializationHelper.ToJsonResult(null, $"GenderIdentity is not valid {genderIdentity}", 0, false));
                if (string.IsNullOrEmpty(genderIdentity.DisplayName))
                    return Json(SerializationHelper.ToJsonResult(null, $"DisplayName is required.", 0, false));
                InstitutionSettings.PreferredNameArea settings = _institutionSettingService.GetPreferredName();
                bool result = _peopleService.SaveGenderIdentity(
                        genderIdentity.PersonId ?? Account.PersonId, genderIdentity.ToModel(), settings.ApprovalRequired);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Gender Identity

        #region PeopleSearch

        /// <summary>
        /// Searches the specified people search model.
        /// </summary>
        /// <param name="peopleSearchModel">The people search model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("People/Search")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        public JsonResult Search([FromBody] PeopleSearchModel peopleSearchModel)
        {
            try
            {
                if (peopleSearchModel == null)
                    return Json(SerializationHelper.ToJsonResult(null, "The person search is null", 0, false));
                PeopleSearch peopleSearch = new()
                {
                    DisplayName = peopleSearchModel.DisplayName,
                    LastName = peopleSearchModel.LastName,
                    LastNamePrefix = peopleSearchModel.LastNamePrefix,
                    Length = peopleSearchModel.Length.Value,
                    LinkId = CurrentLinkId,
                    MiddleName = peopleSearchModel.MiddleName,
                    PeopleId = peopleSearchModel.PeopleId,
                    StartIndex = peopleSearchModel.StartIndex.Value
                };
                PeopleSearches peopleSearches = peopleSearchModel.Filter == Filter.General
                    ? _peopleService.GetSearch(peopleSearch)
                    : _peopleService.GetSearchByDepartmentHead(peopleSearch);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(peopleSearches
                    .ToViewModel(CurrentNameFormat, _peopleService, CurrentNameSort, general.PeopleIdFormat, ShowMiddleNameInitial, _pictureHelper)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion PeopleSearch

        #region Phone

        /// <summary>
        /// Deletes the phone.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("People/Phones/Delete")]
        public JsonResult DeletePhone([FromBody] int id)
        {
            try
            {
                bool result = false;
                if (id > 0)
                    result = _peopleService.DeletePhone(id);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the list of phones for this instance.
        /// </summary>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("People/Phones")]
        public JsonResult Phones()
        {
            try
            {
                bool allowEdit = _institutionSettingService.GetPhoneNumber().AllowEdit;
                List<ProfilePhoneViewModel> phoneNumbers = _peopleService.GetPhones(Account.PersonId).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    allowEdit,
                    phoneNumbers
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Details of a phone
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("People/Phones/Details")]
        public JsonResult PhonesDetails([FromBody] int id)
        {
            try
            {
                PersonPhone personPhone = null;
                if (id > 0)
                    personPhone = _peopleService.GetPhone(id);
                return Json(SerializationHelper.ToJsonResult(personPhone));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Options for phones
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("People/Phones/Options")]
        public JsonResult PhonesOptions()
        {
            try
            {
                List<ListOptionViewModel> countryOptions = _codeTableService.GetAllCountries().ToViewModel();
                List<InstitutionSettingFilter> phoneTypeFilter = _institutionSettingFilterService.Get(InstitutionSettingFilterType.PhoneNumber);
                if (phoneTypeFilter != null)
                    phoneTypeFilter = phoneTypeFilter.Where(pf => pf.IsActive && pf.IsInclude).ToList();
                List<ListOptionViewModel> phoneTypeOptions = phoneTypeFilter.ToViewModel();
                List<ListOptionViewModel> doNotCallReasons = _codeTableService.GetByName(CodeTableName.NoContact, true).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    countryOptions,
                    phoneTypeOptions,
                    doNotCallReasons
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the phone.
        /// </summary>
        /// <param name="personPhone">The person phone.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("People/Phones/Save")]
        public JsonResult SavePhone([FromBody] PersonPhone personPhone)
        {
            try
            {
                bool result = false;
                if (!_institutionSettingService.GetPhoneNumber().AllowEdit)
                    return Json(SerializationHelper.ToJsonResult(result));
                if (personPhone.Id > 0)
                    result = _peopleService.UpdatePhone(personPhone, Account.PersonId);
                else
                    result = _peopleService.CreatePhone(personPhone, Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Updates the primary phone.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("People/Phones/SetAsPrimary")]
        public JsonResult UpdatePrimaryPhone([FromBody] int id)
        {
            try
            {
                bool result = false;
                if (!_institutionSettingService.GetPhoneNumber().AllowEdit)
                    return Json(SerializationHelper.ToJsonResult(result));
                if (id > 0)
                    result = _peopleService.UpdatePrimaryPhone(Account.PersonId, id);
                return Json(SerializationHelper.ToJsonResult(result));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion Phone

        /// <summary>
        /// Currents the account email.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("People/CurrentAccountEmail")]
        public JsonResult CurrentAccountEmail()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(Account.Email));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Endpoint to get the demographic information of a person.
        /// </summary>
        /// <param name="model">The impersonate model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("People/Disabilities")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult Disabilities([FromBody] ImpersonateModel model)
        {
            try
            {
                List<PeopleDisability> disabilities = _peopleService.GetDisabilities(model.ImpersonateInfo.PersonId);

                InstitutionSettings.Logging logging = _institutionSettingService.GetLogging(ApplicationName.SelfService);
                if (logging.EnableHealthInformation)
                {
                    Claim userGuidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                    Guid personGuid = _peopleService.GetPersonGuid(model.ImpersonateInfo.PersonId);

                    string authenticatedPersonIdInformation = string.Empty;
                    string requestedPersonIdInformation = string.Empty;

                    if (logging.IncludePersonId)
                    {
                        authenticatedPersonIdInformation = $" (PersonId: {Account.PersonId})";
                        requestedPersonIdInformation = $" (PersonId: {model.ImpersonateInfo.PersonId})";
                    }

                    _logger.LogHealthInformation(Constants._product,
                        $"The user {userGuidClaim.Value}{authenticatedPersonIdInformation} accessed the disability information for ID = {personGuid}{requestedPersonIdInformation}",
                        actionType: "View",
                        userGuidClaim?.Value != null ? Guid.Parse(userGuidClaim.Value) : null,
                        logging.IncludeClientIp ? _logger.GetIpAddress(HttpContext) : null,
                        logging.IncludePrincipalId ? HttpContext.User.Identity?.Name : null);
                }

                return Json(SerializationHelper.ToJsonResult(disabilities));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Endpoint to get the full name of a person.
        /// </summary>
        /// <param name="id">The person id.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpGet]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult FullName(int? id)
        {
            try
            {
                id ??= Account.PersonId;
                if (id <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "Unable to retrieve Fullname, invalid id.", 0, false));
                People people = _peopleService.Get(id.Value);
                return Json(SerializationHelper.ToJsonResult(people.ToViewModel(_nameFormatService, ShowMiddleNameInitial)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the picture of a person.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpGet]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public async Task<ActionResult> Picture(int? id)
        {
            try
            {
                id ??= Account.PersonId;
                if (id <= 0)
                    _logger.LogError(Constants._product, typeof(PeopleController).FullName, string.Empty);
                FileStreamResult result = null;
                if (!_institutionSettingService.GetStudentRecords().ShowStudentPicture)
                    return result;
                Picture picture = _peopleService.GetPicture(id.Value);
                if (picture != null)
                    return await _pictureHelper.GetPictureAsync(picture);
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Gets the profile account
        /// </summary>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpGet]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult ProfileAccount()
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                People people = _peopleService.Get(Account.PersonId);
                return Json(SerializationHelper.ToJsonResult(people.ToViewModel(Account, general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Stops the list.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult StopList([FromBody] ImpersonateModel model)
        {
            try
            {
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<StopList> stopLists = _peopleService.GetStopList(personId);
                return Json(SerializationHelper.ToJsonResult(stopLists.ToViewModel(general.DateTimeCulture)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Tests the scores.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpPost]
        [Route("People/TestScores")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult TestScores([FromBody] ImpersonateModel model)
        {
            try
            {
                if (model.ImpersonateInfo?.PersonId <= 0)
                    return Json(SerializationHelper.ToJsonResult(null, "Unable to retrieve TestScores, invalid id.", 0, false));

                List<TestScoreDetail> testScoreDetails = _peopleService.GetTestScores(model.ImpersonateInfo.PersonId);
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                return Json(SerializationHelper.ToJsonResult(testScoreDetails.ToViewModel(general)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #region Private Methods

        /// <summary>
        /// Demographics the is valid.
        /// </summary>
        /// <param name="demographic">The demographic.</param>
        /// <returns></returns>
        private bool DemographicIsValid(Demographic demographic)
        {
            InstitutionSettings.Demographic settings = _institutionSettingService.GetDemographic();
            if (settings == null)
                return false;
            if (settings.Ethnicity.Equals("2") && demographic.EthnicityId == null)
                return DemographicNotValid("Ethnicity");
            if (settings.MaritalStatus.Equals("2") && demographic.MaritalStatusId == null)
                return DemographicNotValid("MaritalStatus");
            if (settings.Religion.Equals("2") && demographic.ReligionId == null)
                return DemographicNotValid("Religion");
            if (settings.VeteranStatus.Equals("2") && demographic.VeteranId == null)
                return DemographicNotValid("VeteranStatus");
            if (settings.PrimaryCitizenship.Equals("2") && demographic.CitizenshipId == null)
                return DemographicNotValid("PrimaryCitizenship");
            if (settings.SecondaryCitizenship.Equals("2") && demographic.SecondaryCitizenshipId == null)
                return DemographicNotValid("SecondaryCitizenship");
            if (settings.Visa.Equals("2") && demographic.VisaId == null)
                return DemographicNotValid("Visa");
            if (settings.CountryOfBirth.Equals("2") && demographic.CountryOfBirthId == null)
                return DemographicNotValid("CountryOfBirth");
            if (settings.PrimaryLanguage.Equals("2") && demographic.LanguageId == null)
                return DemographicNotValid("PrimaryLanguage");
            if (settings.MonthsInCountry.Equals("2") && demographic.MonthsInCountry == null)
                return DemographicNotValid("MonthsInCountry");
            if (settings.SecondaryLanguage.Equals("2") && demographic.SecondaryLanguageId == null)
                return DemographicNotValid("SecondaryLanguage");
            return true;
        }

        /// <summary>
        /// Log when Demographic is not valid.
        /// </summary>
        /// <param name="demographicSetting">The demographic setting.</param>
        /// <returns></returns>
        private bool DemographicNotValid(string demographicSetting)
        {
            _logger.LogError(Constants._product, "DemographicIsValid", demographicSetting + " is required.");
            return false;
        }

        /// <summary>
        /// Sends the agreement notification asynchronous.
        /// </summary>
        /// <param name="agreementId">The agreement identifier.</param>
        /// <param name="year">The year.</param>
        /// <param name="term">The term.</param>
        private async Task SendAgreementNotificationAsync(int agreementId, string year, string term)
        {
            try
            {
                if (agreementId > 0 && Account.PersonId > 0)
                {
                    AgreementDetail agreementDetail = _agreementService.GetById(agreementId);

                    string eventNotification = string.Empty;

                    // Verify notification type
                    if (agreementDetail.AgreementType == AgreementType.Registration)
                        eventNotification = NotificationEvent.TradRegAgreementAccepted;
                    else if (agreementDetail.AgreementType == AgreementType.Form1098T)
                        eventNotification = NotificationEvent.FinancesForm1098TAccepted;
                    else
                        return;

                    bool isActive = await _notificationsHelper.EventIsActiveAsync(eventNotification);
                    if (!isActive)
                        return;
                    List<NotificationToken> currentTokens = _notificationsHelper.GetPersonNotificationTokensByPersonId(_peopleService, Account.PersonId);
                    if (currentTokens != null)
                    {
                        InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                        CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                        if (agreementDetail.AgreementType == AgreementType.Registration)
                        {
                            currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "agreement.term", Value = term } });
                            currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "agreement.year", Value = year } });
                            currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "agreement.accepteddate", Value = FormatHelper.ToShortDate(DateTime.Now, datetimeCulture) } });
                            currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "agreement.title", Value = agreementDetail.Title } });
                        }
                        else if (agreementDetail.AgreementType == AgreementType.Form1098T)
                        {
                            currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "consent.accepteddate", Value = FormatHelper.ToShortDate(DateTime.Now, datetimeCulture) } });
                            currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "consent.title", Value = agreementDetail.Title } });
                        }

                        _notificationsHelper.Create(new NotificationEventModel
                        {
                            EventKey = eventNotification,
                            Tokens = currentTokens
                        });
                    }
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeopleController).FullName, exception.Message, exception);
            }
        }

        #endregion Private Methods
    }
}