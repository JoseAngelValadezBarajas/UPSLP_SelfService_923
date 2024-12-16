// --------------------------------------------------------------------
// <copyright file="LayoutController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Enum;
using Hedtech.PowerCampus.Core.DTO;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Navigation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using SelfService.Filters;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using SelfService.Mappers;
using SelfService.Models.Notifications;
using SelfService.Models.Permissions;
using SelfService.Models.Resources;
using SelfService.Models.ResourcesTypes.Account;
using SelfService.Models.ResourcesTypes.Administration;
using SelfService.Models.ResourcesTypes.Admissions;
using SelfService.Models.ResourcesTypes.Advising;
using SelfService.Models.ResourcesTypes.Checklist;
using SelfService.Models.ResourcesTypes.Classes;
using SelfService.Models.ResourcesTypes.ContinuingEducation;
using SelfService.Models.ResourcesTypes.Department;
using SelfService.Models.ResourcesTypes.Donations;
using SelfService.Models.ResourcesTypes.Errors;
using SelfService.Models.ResourcesTypes.Finances;
using SelfService.Models.ResourcesTypes.General;
using SelfService.Models.ResourcesTypes.Generic;
using SelfService.Models.ResourcesTypes.Grades;
using SelfService.Models.ResourcesTypes.Home;
using SelfService.Models.ResourcesTypes.MakeGift;
using SelfService.Models.ResourcesTypes.Planning;
using SelfService.Models.ResourcesTypes.Registration;
using SelfService.Models.ResourcesTypes.Search;
using SelfService.Models.ResourcesTypes.Shared;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Layout route.
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [TypeFilter(typeof(SessionExpiredAttribute))]
    public class LayoutController : BaseEndpointController
    {
        /// <summary>
        /// The cache
        /// </summary>
        private readonly IMemoryCache _cache;

        /// <summary>
        /// The Institution Setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<LayoutController> _logger;

        /// <summary>
        /// The name format service
        /// </summary>
        private readonly INameFormatService _nameFormatService;

        /// <summary>
        /// The notification service
        /// </summary>
        private readonly INotificationService _notificationService;

        /// <summary>
        /// The resources helper
        /// </summary>
        private readonly IResourcesHelper _resourcesHelper;

        /// <summary>
        /// The setting helper
        /// </summary>
        private readonly ISettingHelper _settingHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="LayoutController"/> class.
        /// </summary>
        /// <param name="cache">The cache.<seealso cref="IMemoryCache"/></param>
        /// <param name="institutionSettingService">The institution setting service.<seealso cref="IInstitutionSettingService"/></param>
        /// <param name="nameFormatService">The name format service.<seealso cref="INameFormatService"/></param>
        /// <param name="notificationService">The notification service.<seealso cref="INotificationService"/></param>
        /// <param name="resourcesHelper">The resources helper.<seealso cref="IResourcesHelper"/></param>
        /// <param name="serializationHelper">The serialization helper.<seealso cref="ISerializationHelper"/></param>
        /// <param name="settingHelper">The setting helper.<seealso cref="ISettingHelper"/></param>
        /// <param name="logger">The logger.<seealso cref="IAppLogger{LayoutController}"/></param>
        public LayoutController(
            IMemoryCache cache,
            IInstitutionSettingService institutionSettingService,
            INameFormatService nameFormatService,
            INotificationService notificationService,
            IResourcesHelper resourcesHelper,
            ISerializationHelper serializationHelper,
            ISettingHelper settingHelper,
            IAppLogger<LayoutController> logger)
            : base(serializationHelper)
        {
            _cache = cache;
            _institutionSettingService = institutionSettingService;
            _nameFormatService = nameFormatService;
            _notificationService = notificationService;
            _resourcesHelper = resourcesHelper;
            _settingHelper = settingHelper;

            _logger = logger;
        }

        /// <summary>
        /// Endpoint to get the initial data for a page.
        /// </summary>
        /// <param name="siteMapPage">The siteMapPage data.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Layout/InitialData")]
        public JsonResult InitialData([FromBody] SiteMapPage siteMapPage)
        {
            try
            {
                if (!ValidationHelper.IsValidResource(siteMapPage))
                    return Json(SerializationHelper.ToJsonResult(null, null, -1, false));

                string displayName = string.Empty;
                int sessionTimeout = -1;
                int notificationTimeout = 0;
                double tokenTimeout = -1;
                bool isAdfs = false;
                bool isSaml = false;
                LayoutPermissions layoutPermissions = new();

                bool isAuthenticated = User.Identity.IsAuthenticated;
                if (!isAuthenticated)
                {
                    _cache.RemoveAllSettings();
                }
                else if (Account != null)
                {
                    IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity).Claims;
                    layoutPermissions.HasProfileClaim = claims.Any(c => c.Type == ClaimsConstants.GeneralProfile);

                    displayName = Account.DisplayName;

                    isAdfs = Account.AuthenticationMode == (int)StoreMode.ADFS;
                    isSaml = Account.AuthenticationMode == (int)StoreMode.SAML;

                    sessionTimeout = Account.SessionTimeoutMinutes * 60;
                    notificationTimeout = Constants._defaultNotificationTimeout;
                }

                BuildInformation buildInfo = _settingHelper.GetBuildInfo();

                InstitutionSettings.Theme theme = _institutionSettingService.GetTheme();

                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                string uiCulture = _settingHelper.GetLanguage(Account);
                CultureInfo uiCultureInfo = CultureInfo.GetCultureInfo(uiCulture);
                bool isRightToLeft = uiCultureInfo.TextInfo.IsRightToLeft;
                CultureInfo dateTimeCultureInfo = CultureInfo.GetCultureInfo(general.DateTimeCulture);
                CultureInfo currencyCultureInfo = CultureInfo.GetCultureInfo(general.CurrencyCulture);
                DateTimeFormatInfo dateTimeFormatInfo = dateTimeCultureInfo.DateTimeFormat;
                string shortTimePattern = dateTimeFormatInfo.ShortTimePattern;
                if (shortTimePattern.Contains("tt"))
                {
                    shortTimePattern = dateTimeFormatInfo.AMDesignator.StartsWith("A")
                        ? shortTimePattern.Replace("tt", "A")
                        : shortTimePattern.Replace("tt", "a");
                }

                List<MenuOptionViewModel> options = GetMenuOptions();
                LayoutResources layoutResources = GetResources(new SiteMapPage("Generic", "Layout")) as LayoutResources;
                object permissions = GetPermissions(siteMapPage);
                object resources = GetResources(siteMapPage);

                List<NotificationViewModel> notifications = null;
                // TODO: This will be used later for notifications
                //if (isAuthenticated)
                //{
                //    bool showMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.General);
                //    string dateTimeCultureFormat = _institutionSettingService.GetGeneral().DateTimeCulture;
                //    notifications = _notificationService.Get(Account.PersonId).ToViewModel(_nameFormatService, showMiddleNameInitial, dateTimeCultureFormat);
                //}

                return Json(SerializationHelper.ToJsonResult(new LayoutData
                {
                    BuildVersion = buildInfo?.Version,
                    BuildYear = buildInfo?.Date.Year,
                    Cultures = new Cultures
                    {
                        IsRightToLeft = isRightToLeft,
                        UiCulture = uiCulture,
                        DateTimeCulture = general.DateTimeCulture,
                        CurrencyCulture = general.CurrencyCulture,
                        NumberCulture = general.NumberCulture,
                        ShortTimePattern = shortTimePattern,
                        ShortDatePattern = dateTimeFormatInfo.ShortDatePattern,
                        AmDesignator = dateTimeFormatInfo.AMDesignator,
                        PmDesignator = dateTimeFormatInfo.PMDesignator,
                        FirstDayOfWeek = dateTimeFormatInfo.FirstDayOfWeek,
                        CurrencySymbol = currencyCultureInfo.NumberFormat.CurrencySymbol
                    },
                    DisplayName = displayName,
                    HasProfile = Account?.PersonId > 0,
                    IsAuthenticated = isAuthenticated,
                    IsAdfs = isAdfs,
                    IsSaml = isSaml,
                    SessionTimeout = sessionTimeout,
                    NotificationTimeout = notificationTimeout,
                    TokenTimeout = tokenTimeout,
                    LayoutPermissions = layoutPermissions,
                    Notifications = notifications,
                    Options = options,
                    Permissions = permissions,
                    Resources = resources,
                    LayoutResources = layoutResources,
                    Theme = theme
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(LayoutController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, -1, false));
            }
        }

        /// <summary>
        /// Endpoint to get all the permissions by page
        /// To use claims:
        /// Get the collection of claims:
        ///     ClaimsIdentity claimsIdentity = User.Identity as ClaimsIdentity;
        /// Set the corresponding claim:
        ///     Activities = claimsIdentity.HasClaim(c => c.Type == $"{idModule}.{idPage}.Activities"),
        /// </summary>
        /// <param name="siteMapPage">The siteMapPage data.</param>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpGet]
        [Route("Layout/Permissions/{idModule}/{idPage}")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Permissions(SiteMapPage siteMapPage)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(GetPermissions(siteMapPage)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(LayoutController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 404, false));
            }
        }

        /// <summary>
        /// Endpoint to get the resources of a page.
        /// </summary>
        /// <param name="siteMapPage">The siteMapPage data.</param>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [Route("Layout/Resources/{idModule}/{idPage}")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Resources(SiteMapPage siteMapPage)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(GetResources(siteMapPage)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(LayoutController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, -1, false));
            }
        }

        #region Private Methods

        /// <summary>
        /// Get the menu options
        /// </summary>
        /// <returns>List(MenuOptionViewModel)</returns>
        private List<MenuOptionViewModel> GetMenuOptions()
        {
            List<MenuOptionViewModel> options = null;
            try
            {
                string language = _settingHelper.GetLanguage(Account);

                SiteMap sitemap = HttpContext.Session.GetObject<SiteMap>(Constants._siteMapSession);
                List<MenuResources> resources = _resourcesHelper.GetResourceType<List<MenuResources>>(language,
                            new SiteMapPage("Shared", "MainMenu"),
                            ValidationHelper.IsValidResource);
                List<MenuSiteMap> mainOptionsFormatted = sitemap.Options.Select(o => new MenuSiteMap
                {
                    SiteMapId = o.SiteMapOptionId,
                    Id = o.LinkId,
                    Visible = o.IsVisible,
                    ExternalLink = o.ExternalLink,
                    IsCustom = o.IsCustom
                }).ToList();
                IEnumerable<MenuSiteMap> subOptionsFormatted = sitemap.OptionsDetail.Select(o => new MenuSiteMap
                {
                    SiteMapId = o.SiteMapOptionDetailId,
                    Id = o.LinkId,
                    Visible = o.IsVisible,
                    ParentId = o.SiteMapOptionId,
                    ExternalLink = o.ExternalLink,
                    IsCustom = o.IsCustom
                });
                options = SiteMapToMenu(resources, mainOptionsFormatted);
                Regex regExpPeopleCodeId = new("%peopleCodeId%");
                Regex regExpPeopleId = new("%peopleId%");
                Regex regExpPersonId = new("%personId%");
                Regex regExpUserName = new("%userName%");
                Regex regExpEmail = new("%email%");
                MatchEvaluator matchEvaluator = new(GetUrlParametersMatch);
                List<MenuResources> subresources;
                List<MenuSiteMap> subset;
                foreach (MenuOptionViewModel option in options)
                {
                    subresources = new();
                    if (!option.IsCustom)
                    {
                        subresources = _resourcesHelper.GetResourceType<List<MenuResources>>(language,
                            new SiteMapPage(option.Id[0..^2], "Menu"),
                            ValidationHelper.IsValidResource);
                    }
                    else if (!string.IsNullOrEmpty(option.Url))
                    {
                        option.Url = regExpPeopleCodeId.Replace(option.Url, matchEvaluator);
                        option.Url = regExpPeopleId.Replace(option.Url, matchEvaluator);
                        option.Url = regExpPersonId.Replace(option.Url, matchEvaluator);
                        option.Url = regExpUserName.Replace(option.Url, matchEvaluator);
                        option.Url = regExpEmail.Replace(option.Url, matchEvaluator);
                    }
                    subset = subOptionsFormatted.Where(o => o.ParentId == option.SiteMapId).ToList();
                    option.Options = SiteMapToMenu(subresources, subset);
                    foreach (MenuOptionViewModel suboption in option.Options)
                    {
                        if (suboption.IsCustom && !string.IsNullOrEmpty(suboption.Url))
                        {
                            suboption.Url = regExpPeopleCodeId.Replace(suboption.Url, matchEvaluator);
                            suboption.Url = regExpPeopleId.Replace(suboption.Url, matchEvaluator);
                            suboption.Url = regExpPersonId.Replace(suboption.Url, matchEvaluator);
                            suboption.Url = regExpUserName.Replace(suboption.Url, matchEvaluator);
                            suboption.Url = regExpEmail.Replace(suboption.Url, matchEvaluator);
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(LayoutController).FullName, exception.Message, exception);
            }
            return options;
        }

        /// <summary>
        ///  Get the permissions
        /// </summary>
        /// <param name="siteMapPage">The siteMapPage data.</param>
        /// <returns>object</returns>
        private object GetPermissions(SiteMapPage siteMapPage)
        {
            try
            {
                if (siteMapPage is null
                    || (string.IsNullOrEmpty(siteMapPage.IdModule) && string.IsNullOrEmpty(siteMapPage.IdPage)))
                    return null;

                object permission = null;
                IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity).Claims;
                return siteMapPage.IdModule switch
                {
                    #region Account

                    "Account" when siteMapPage.IdPage.Equals("MyProfile") => new ProfilePermissions
                    {
                        Account = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileAccount),
                        Addresses = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileAddresses),
                        Agreements = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileAgreements),
                        ChangePassword = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileAccountChangePassword),
                        Demographic = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileDemographic),
                        EmergencyContacts = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileEmergencyContacts),
                        EthnicityAndRace = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileEthnicityAndRace),
                        PhoneNumbers = claims.Any(c => c.Type == ClaimsConstants.GeneralProfilePhoneNumbers),
                        PreferredName = claims.Any(c => c.Type == ClaimsConstants.GeneralProfilePreferredName),
                        Profile = claims.Any(c => c.Type == ClaimsConstants.GeneralProfile),
                        RegistrationSummary = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileRegistrationSummary),
                        SharedAccess = claims.Any(c => c.Type == ClaimsConstants.GeneralProfileSharedAccess)
                    },

                    #endregion Account

                    #region Administration

                    "Administration" when siteMapPage.IdPage.Equals("ConEdSetup") => new ConEdSetupPermissions
                    {
                        ConEdDefaults = claims.Any(c => c.Type == ClaimsConstants.AdministrationConEdSetupConEdDefaults),
                        ConEdRegistration = claims.Any(c => c.Type == ClaimsConstants.AdministrationConEdSetupConEdRegistration)
                    },
                    "Administration" when siteMapPage.IdPage.Equals("GeneralSetup") => new GeneralSetupPermissions
                    {
                        DashboardMessages = claims.Any(c => c.Type == ClaimsConstants.AdministrationGeneralSetupDashboardMessages),
                        PeriodFilters = claims.Any(c => c.Type == ClaimsConstants.AdministrationGeneralSetupPeriodFilters),
                        Dossier = claims.Any(c => c.Type == ClaimsConstants.AdministrationGeneralSetupDossier),
                        Checklist = claims.Any(c => c.Type == ClaimsConstants.AdministrationGeneralSetupChecklist)
                    },
                    "Administration" when siteMapPage.IdPage.Equals("InstructorSetup") => new InstructorSetupPermissions
                    {
                        AdvisorWarnings = claims.Any(c => c.Type == ClaimsConstants.AdministrationInstructorSetupAdvisorWarnings),
                        AssociationHead = claims.Any(c => c.Type == ClaimsConstants.AdministrationInstructorSetupAssociationHead),
                        AssociationFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdministrationInstructorSetupAssociationFacultyDossier),
                        CampusCoordinatorFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdministrationInstructorSetupCampusCoordinatorFacultyDossier),
                        CourseManagement = claims.Any(c => c.Type == ClaimsConstants.AdministrationInstructorSetupCourseManagement),
                        DepartmentHead = claims.Any(c => c.Type == ClaimsConstants.AdministrationInstructorSetupDepartmentHead),
                        CampusCoordinator = claims.Any(c => c.Type == ClaimsConstants.AdministrationInstructorSetupCampusCoordinator),
                        DepartmentHeadFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdministrationInstructorSetupDepartmentHeadFacultyDossier),
                        Offices = claims.Any(c => c.Type == ClaimsConstants.AdministrationInstructorSetupOffices),
                        OfficesFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdministrationInstructorSetupOfficesFacultyDossier),
                    },
                    "Administration" when siteMapPage.IdPage.Equals("WebsiteSetup") => new WebsiteSetupPermissions
                    {
                        CourseMaterials = claims.Any(c => c.Type == ClaimsConstants.AdministrationWebsiteSetupCourseMaterials),
                        EmailProvider = claims.Any(c => c.Type == ClaimsConstants.AdministrationWebsiteSetupEmailProvider),
                        NameFormatCategories = claims.Any(c => c.Type == ClaimsConstants.AdministrationWebsiteSetupNameFormatCategories),
                        NameFormats = claims.Any(c => c.Type == ClaimsConstants.AdministrationWebsiteSetupNameFormats),
                        PaymentProvider = claims.Any(c => c.Type == ClaimsConstants.AdministrationWebsiteSetupPaymentProvider),
                        PermissionStore = false,
                        SiteSettings = false,
                        SystemFormats = claims.Any(c => c.Type == ClaimsConstants.AdministrationWebsiteSetupSystemFormats),
                        SystemInformation = claims.Any(c => c.Type == ClaimsConstants.AdministrationWebsiteSetupSystemInformation),
                        Theme = claims.Any(c => c.Type == ClaimsConstants.AdministrationWebsiteSetupThemeEditor),
                        ReCaptcha = claims.Any(c => c.Type == ClaimsConstants.AdministrationWebsiteSetupReCaptcha),
                    },
                    "Administration" when siteMapPage.IdPage.Equals("FormsSetup") => new FormsSetupPermissions
                    {
                        ApplicationFormsSetup = claims.Any(c => c.Type == ClaimsConstants.AdministrationFormsSetupApplication),
                        InquiryFormSetup = claims.Any(c => c.Type == ClaimsConstants.AdministrationFormsSetupInquiry)
                    },
                    "Administration" when siteMapPage.IdPage.Equals("ProfileSetup") => new ProfileSetupPermissions
                    {
                        AddressSettings = claims.Any(c => c.Type == ClaimsConstants.AdministrationProfileSetupAddress),
                        DemographicSettings = claims.Any(c => c.Type == ClaimsConstants.AdministrationProfileSetupDemographic),
                        EmergencyContactSettings = claims.Any(c => c.Type == ClaimsConstants.AdministrationProfileSetupEmergencyContacts),
                        PhoneNumberSettings = claims.Any(c => c.Type == ClaimsConstants.AdministrationProfileSetupPhoneNumber),
                        PreferredNameSettings = claims.Any(c => c.Type == ClaimsConstants.AdministrationProfileSetupPreferredName)
                    },
                    "Administration" when siteMapPage.IdPage.Equals("RequestsSetup") => new RequestsSetupPermissions
                    {
                        AddressRequests = claims.Any(c => c.Type == ClaimsConstants.AdministrationRequestsSetupAddress),
                        DemographicRequests = claims.Any(c => c.Type == ClaimsConstants.AdministrationRequestsSetupDemographic),
                        PreferredNameRequests = claims.Any(c => c.Type == ClaimsConstants.AdministrationRequestsSetupPreferredName)
                    },
                    "Administration" when siteMapPage.IdPage.Equals("StudentSetup") => new StudentSetupPermissions
                    {
                        Agreements = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupAgreements),
                        BlockRegistration = claims.Any(c => c.Type is ClaimsConstants.AdministrationStudentSetupBlockRegistrationBlocks or ClaimsConstants.AdministrationStudentSetupBlockRegistrationRules),
                        FinancialSettings = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupFinancialSettings),
                        GradeMappings = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupGradeMappings),
                        Settings1098T = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupSettings1098T),
                        RegistrationGroups = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupRegistrationGroups),
                        StudentRecords = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupStudentRecords),
                        TraditionalDefaults = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupTraditionalDefaults),
                        TraditionalRegistration = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupTraditionalRegistration),
                        TranscriptRequest = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupTranscriptRequest),
                        SharedAccess = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupSharedAccess)
                    },
                    "Administration" when siteMapPage.IdPage.Equals("BlockRegistration") => new BlockRegistrationPermissions
                    {
                        Blocks = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupBlockRegistrationBlocks),
                        Rules = claims.Any(c => c.Type == ClaimsConstants.AdministrationStudentSetupBlockRegistrationRules),
                    },
                    "Administration" when siteMapPage.IdPage.Equals("DonationsSetup") => new DonationSetupPermissions
                    {
                        Campaigns = claims.Any(c => c.Type == ClaimsConstants.AdministrationDonationsSetupCampaigns),
                        Form = claims.Any(c => c.Type == ClaimsConstants.AdministrationDonationsSetupForm),
                        GiftBatchDefaults = claims.Any(c => c.Type == ClaimsConstants.AdministrationDonationsSetupGiftBatchDefaults),
                    },

                    #endregion Administration

                    #region Advising

                    "Advising" when siteMapPage.IdPage.Equals("ManageAdvisees") => new AdviseesPermissions
                    {
                        MyAdvisees = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdvisees),
                        MyStudents = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudents),
                        MyAssociations = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociations),
                        AllStudents = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudents),
                        FormerAdvisees = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdvisees),
                        Alumni = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumni),
                        MyDepartment = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartment),
                        MyCampus = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampus),
                        MyCampusFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyCampusShareFacultyDossier),
                        MySharedAdvisees = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMySharedAdvisees),
                        AllStudentsFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAllStudentsShareFacultyDossier),
                        AlumniFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesAlumniShareFacultyDossier),
                        FormerAdviseesFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesFormerAdviseesShareFacultyDossier),
                        MyAdviseesFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAdviseesShareFacultyDossier),
                        MyAssociationsFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyAssociationsShareFacultyDossier),
                        MyDepartmentFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyDepartmentShareFacultyDossier),
                        MyStudentsFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdvisingManageAdviseesMyStudentsShareFacultyDossier),
                        Download = true,
                        AuthorizeRegistration = true,
                        ShareAdvisees = true,
                        EmailSelected = true
                    },
                    "Advising" when siteMapPage.IdPage.Equals("AuthorizeAdvisees") => new AdviseesPermissions
                    {
                        MyAdvisees = claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyAdvisees),
                        MyStudents = claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyStudents),
                        MyAssociations = claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyAssociations),
                        AllStudents = claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesAllStudents),
                        FormerAdvisees = claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesFormerAdvisees),
                        Alumni = claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesAlumni),
                        MyDepartment = claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyDepartment),
                        MyCampus = claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMyCampus),
                        MySharedAdvisees = claims.Any(c => c.Type == ClaimsConstants.AdvisingAuthorizeAdviseesMySharedAdvisees),
                        Download = true,
                        AuthorizeRegistration = true,
                        ShareAdvisees = true,
                        EmailSelected = true
                    },
                    "Advising" when siteMapPage.IdPage.Equals("SharedAdvisees") => new SharedAdviseesPermissions
                    {
                        Dossier = claims.Any(c => c.Type == ClaimsConstants.AdvisingSharedAdviseesDossier),
                        FacultyDossier = claims.Any(c => c.Type == ClaimsConstants.AdvisingSharedAdviseesFacultyDossier)
                    },

                    #endregion Advising

                    #region Checklist

                    "Checklist" when siteMapPage.IdPage.Equals("MyTasksMain") => new ChecklistPermissions
                    {
                        EditAction = claims.Any(c => c.Type == ClaimsConstants.ChecklistMyTasksEditActionItem),
                        ViewNotes = claims.Any(c => c.Type == ClaimsConstants.ChecklistMyTasksViewNotes)
                    },

                    #endregion Checklist

                    #region Classes

                    "Classes" when siteMapPage.IdPage.Equals("FacultySchedule") => new FacultySchedulePermissions
                    {
                        ClassList = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementClassList),
                    },
                    "Classes" when siteMapPage.IdPage.Equals("CourseManagementMain") => new CourseManagementMainPermissions
                    {
                        ClassesActivitiesSetup = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementActivities),
                        ClassesActivityGrades = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementActivityGrades),
                        ClassesAlerts = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementAlerts),
                        ClassesAttendance = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementOverallAttendance),
                        ClassesClassList = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementClassList),
                        ClassesClassListDossier = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementClassListDossier),
                        ClassesDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementDailyAttendance),
                        ClassesDashboardNotes = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementDashboardNotes),
                        ClassesGradeMappings = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementGradeMappings),
                        ClassesManageAssistants = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistants),
                        ClassesManageAssistantsDossier = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsDossier),
                        ClassesManageAssistantsGrantActivities = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsGrantActivities),
                        ClassesManageAssistantsGrantActivityGrades = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsGrantActivityGrades),
                        ClassesManageAssistantsGrantAlerts = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsGrantAlerts),
                        ClassesManageAssistantsGrantClassList = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsGrantClassList),
                        ClassesManageAssistantsGrantDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsGrantDailyAttendance),
                        ClassesManageAssistantsGrantDashboardNotes = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsGrantDashboardNotes),
                        ClassesManageAssistantsGrantGradeMappings = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsGrantGradeMappings),
                        ClassesManageAssistantsGrantOverallAttendance = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsGrantOverallAttendance),
                        ClassesManageAssistantsGrantOverallGrades = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsGrantOverallGrades),
                        ClassesManageAssistantsGrantOverallGradesSubmission = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsGrantOverallGradesSubmission),
                        ClassesManageAssistantsGrantWaitList = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementManageAssistantsGrantWaitList),
                        ClassesOverallGrades = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementOverallGrades),
                        ClassesOverallGradesChangeOptions = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementOverallGradesChangeTranscriptGrade),
                        ClassesPermissionRequest = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementPermissionRequests),
                        ClassesPermissionRequestDossier = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementPermissionRequestsDossier),
                        ClassesWaitlist = claims.Any(c => c.Type == ClaimsConstants.ClassesFacultyCourseManagementWaitList),
                        DepartmentActivitiesSetup = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementActivities),
                        DepartmentActivityGrades = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementActivityGrades),
                        DepartmentAlerts = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementAlerts),
                        DepartmentAttendance = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementOverallAttendance),
                        DepartmentClassList = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementClassList),
                        DepartmentClassListDossier = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementClassListDossier),
                        DepartmentDailyAttendance = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementDailyAttendance),
                        DepartmentDashboardNotes = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementDashbaordNotes),
                        DepartmentGradeMappings = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementGradeMappings),
                        DepartmentOverallGrades = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementOverallGrades),
                        DepartmentOverallGradesChangeOptions = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementOverallGradesChangeTranscriptGrade),
                        DepartmentWaitlist = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseManagementWaitList)
                    },

                    #endregion Classes

                    #region Department

                    "Department" when siteMapPage.IdPage.Equals("SetupApprovals") => new DepartmentPermissions
                    {
                        SetupApprovalsFacultyDossier = claims.Any(c => c.Type == ClaimsConstants.DepartmentSetupApprovalsFacultyDossier)
                    },
                    "Department" when siteMapPage.IdPage.Equals("CourseTemplates") => new CourseTemplatesPermissions
                    {
                        FacultyDossier = claims.Any(c => c.Type == ClaimsConstants.DepartmentCourseTemplatesFacultyDossier)
                    },

                    #endregion Department

                    #region Grades

                    "Grades" when siteMapPage.IdPage.Equals("GradeReportMain") => new GradesPermissions
                    {
                        ViewDetails = claims.Any(c => c.Type == ClaimsConstants.GradesGradeReportCoursework)
                    },

                    #endregion Grades

                    #region Home

                    "Home" when siteMapPage.IdPage.Equals("Dashboard") => new GeneralSetupPermissions
                    {
                        Checklist = claims.Any(c => c.Type == ClaimsConstants.ChecklistMyTasksCreateActionItem)
                    },

                    #endregion Home

                    #region Shared Access

                    "SharedAccess" when siteMapPage.IdPage.Equals("Students") => new GradesPermissions
                    {
                        ViewDetails = claims.Any(c => c.Type == ClaimsConstants.GradesGradeReportCoursework)
                    },

                    #endregion Shared Access

                    _ => permission,
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(LayoutController).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Get the resources
        /// </summary>
        /// <param name="siteMapPage">The siteMapPage data.</param>
        /// <returns>string</returns>
        private object GetResources(SiteMapPage siteMapPage)
        {
            try
            {
                if (siteMapPage is null
                    || (string.IsNullOrEmpty(siteMapPage.IdModule) && string.IsNullOrEmpty(siteMapPage.IdPage)))
                    return null;

                object json = null;
                string language = _settingHelper.GetLanguage(Account);
                if (siteMapPage.IdPage.Equals("Menu"))
                    return _resourcesHelper.GetResourceType<MainMenuResources>(language, siteMapPage);

                return siteMapPage.IdModule switch
                {
                    #region Account

                    "Account" when siteMapPage.IdPage.Equals("AccountMain")
                        => _resourcesHelper.GetResourceType<AccountMainResources>(language, siteMapPage),
                    "Account" when siteMapPage.IdPage.Equals("AddressesMain")
                        => _resourcesHelper.GetResourceType<AddressesMainResources>(language, siteMapPage),
                    "Account" when siteMapPage.IdPage.Equals("AgreementsMain")
                        => _resourcesHelper.GetResourceType<AgreementsMainResources>(language, siteMapPage),
                    "Account" when siteMapPage.IdPage.Equals("DemographicMain")
                        => _resourcesHelper.GetResourceType<DemographicMainResources>(language, siteMapPage),
                    "Account" when siteMapPage.IdPage.Equals("EthnicityMain")
                        => _resourcesHelper.GetResourceType<EthnicityMainResources>(language, siteMapPage),
                    "Account" when siteMapPage.IdPage.Equals("MyProfile")
                        => _resourcesHelper.GetResourceTypeWithLayout<MyProfileResources>(language, siteMapPage),
                    "Account" when siteMapPage.IdPage.Equals("PhoneNumberMain")
                        => _resourcesHelper.GetResourceTypeWithLayout<PhoneNumberMainResources>(language, siteMapPage),
                    "Account" when siteMapPage.IdPage.Equals("EmergencyContactMain")
                        => _resourcesHelper.GetResourceTypeWithLayout<EmergencyContactMainResources>(language, siteMapPage),
                    "Account" when siteMapPage.IdPage.Equals("PreferredNameMain")
                        => _resourcesHelper.GetResourceTypeWithLayout<PreferredNameMainResources>(language, siteMapPage),
                    "Account" when siteMapPage.IdPage.Equals("ProfileMain")
                        => _resourcesHelper.GetResourceType<ProfileMainResources>(language, siteMapPage),
                    "Account" when siteMapPage.IdPage.Equals("SharedAccessMain")
                        => _resourcesHelper.GetResourceType<Models.ResourcesTypes.Account.SharedAccessMainResources>(language, siteMapPage),
                    "Account" when siteMapPage.IdPage.Equals("RegistrationSummaryMain")
                    => _resourcesHelper.GetUnionResourceType<RegistrationSummaryMainResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "RegistrationSummaryModal"),
                            new DynamicValue("Shared", "StudentCourseStatus"),
                            new DynamicValue("Shared", "StudentCourseMessages")),

                    #endregion Account

                    #region Administration

                    "Administration" when siteMapPage.IdPage.Equals("Agreements")
                        => _resourcesHelper.GetResourceType<AgreementsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("ConEdSetup")
                        => _resourcesHelper.GetResourceTypeWithLayout<ConEdSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("CourseMaterials")
                        => _resourcesHelper.GetResourceType<CourseMaterialsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("NamePart")
                        => _resourcesHelper.GetResourceType<NamePartResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("GeneralSetup")
                        => _resourcesHelper.GetResourceTypeWithLayout<GeneralSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("InstructorSetup")
                        => _resourcesHelper.GetResourceTypeWithLayout<InstructorSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("Settings1098T")
                        => _resourcesHelper.GetResourceType<Settings1098TResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("StudentSetup")
                        => _resourcesHelper.GetResourceTypeWithLayout<StudentSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("AdvisorWarnings")
                        => _resourcesHelper.GetResourceType<AdvisorWarningsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("FacultyPages")
                        => _resourcesHelper.GetResourceType<FacultyPagesResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("GlobalSettings")
                        => _resourcesHelper.GetResourceType<GlobalSettingsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("EmailProvider")
                        => _resourcesHelper.GetResourceType<EmailProviderResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("NameFormatCategories")
                        => _resourcesHelper.GetResourceType<NameFormatCategoriesResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("NameFormats")
                        => _resourcesHelper.GetResourceType<NameFormatsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("NotificationsSetup")
                        => _resourcesHelper.GetResourceType<NotificationsSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("PaymentProvider")
                        => _resourcesHelper.GetResourceType<PaymentProviderResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("DashboardMessages")
                        => _resourcesHelper.GetResourceType<Models.ResourcesTypes.Administration.DashboardMessagesResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("PeriodFilters")
                        => _resourcesHelper.GetResourceType<PeriodFiltersResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("DossierSetup")
                        => _resourcesHelper.GetResourceType<DossierSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("ChecklistSetup")
                        => _resourcesHelper.GetResourceType<ChecklistSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("RegistrationGroups")
                        => _resourcesHelper.GetResourceType<RegistrationGroupsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("StudentRecords")
                        => _resourcesHelper.GetResourceType<StudentRecordsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("Theme")
                         => _resourcesHelper.GetResourceType<ThemeResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("TraditionalDefaults")
                        => _resourcesHelper.GetResourceType<TraditionalDefaultsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("TraditionalRegistration")
                        => _resourcesHelper.GetResourceType<TraditionalRegistrationResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("ConEdRegistration")
                        => _resourcesHelper.GetResourceType<ConEdRegistrationResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("ConEdDefaults")
                        => _resourcesHelper.GetResourceType<ConEdDefaultsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("WebsiteSetup")
                        => _resourcesHelper.GetResourceTypeWithLayout<WebsiteSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("SystemInformation")
                        => _resourcesHelper.GetResourceType<SystemInformationResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("FormsSetup")
                        => _resourcesHelper.GetResourceTypeWithLayout<FormsSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("LayoutList")
                        => _resourcesHelper.GetResourceType<LayoutListResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("InquiryLayoutList")
                        => _resourcesHelper.GetResourceType<LayoutListResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("FinancialSettings")
                        => _resourcesHelper.GetResourceType<FinancialSettingsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("ProfileSetup")
                        => _resourcesHelper.GetResourceTypeWithLayout<ProfileSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("RequestsSetup")
                         => _resourcesHelper.GetResourceTypeWithLayout<RequestsSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("AddressRequests")
                        => _resourcesHelper.GetResourceType<AddressRequestsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("DemographicRequests")
                        => _resourcesHelper.GetResourceType<DemographicsRequestsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("PreferredNameRequests")
                        => _resourcesHelper.GetResourceType<PreferredNameRequestsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("ApplicationSetup")
                        => _resourcesHelper.GetResourceTypeWithLayout<ApplicationSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("InquirySetup")
                        => _resourcesHelper.GetResourceType<InquirySetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("DemographicSettings")
                        => _resourcesHelper.GetResourceType<DemographicSettingsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("AddressSettings")
                        => _resourcesHelper.GetResourceType<AddressSettingsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("EmergencyContactSettings")
                        => _resourcesHelper.GetResourceType<EmergencyContactSettingsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("PhoneNumberSettings")
                        => _resourcesHelper.GetResourceType<PhoneNumberSettingsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("PreferredNameSettings")
                        => _resourcesHelper.GetResourceType<PreferredNameSettingsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("DepartmentHead")
                        => _resourcesHelper.GetResourceType<DepartmentHeadResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("AssociationHead")
                        => _resourcesHelper.GetResourceType<AssociationHeadResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("OfficesSetup")
                        => _resourcesHelper.GetResourceType<OfficesSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("OfficesSetupAddModal")
                        => _resourcesHelper.GetResourceType<OfficesSetupAddModalResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("CampusCoordinator")
                        => _resourcesHelper.GetResourceType<CampusCoordinatorResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("BlockRegistration")
                        => _resourcesHelper.GetResourceType<BlockRegistrationResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("Block")
                        => _resourcesHelper.GetResourceType<BlockResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("BlockList")
                        => _resourcesHelper.GetResourceType<BlockListResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("Rule")
                        => _resourcesHelper.GetResourceType<RuleResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("TranscriptRequest")
                        => _resourcesHelper.GetResourceType<TranscriptRequestResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("DonationsSetup")
                        => _resourcesHelper.GetResourceType<DonationsSetupResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("Campaigns")
                        => _resourcesHelper.GetResourceType<CampaignsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("GiftBatchDefaults")
                        => _resourcesHelper.GetResourceType<GiftBatchDefaultsResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("Form")
                        => _resourcesHelper.GetResourceType<FormResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("SharedAccessMain")
                        => _resourcesHelper.GetResourceType<Models.ResourcesTypes.Administration.SharedAccessMainResources>(language, siteMapPage),
                    "Administration" when siteMapPage.IdPage.Equals("ReCaptcha")
                        => _resourcesHelper.GetResourceType<ReCaptchaResources>(language, siteMapPage),

                    #endregion Administration

                    #region Admissions

                    "Admissions" when siteMapPage.IdPage.Equals("Applications")
                        => _resourcesHelper.GetResourceTypeWithLayout<ApplicationsResources>(language, siteMapPage),
                    "Admissions" when siteMapPage.IdPage.Equals("Inquiries")
                        => _resourcesHelper.GetResourceTypeWithLayout<InquiriesResources>(language, siteMapPage),
                    "Admissions" when siteMapPage.IdPage.Equals("ApplicationForm")
                        => _resourcesHelper.GetResourceTypeWithLayout<ApplicationFormResources>(language, siteMapPage),
                    "Admissions" when siteMapPage.IdPage.Equals("InquiryForm")
                        => _resourcesHelper.GetResourceTypeWithLayout<InquiryFormResources>(language, siteMapPage),

                    #endregion Admissions

                    #region Advising

                    "Advising" when siteMapPage.IdPage.Equals("DisabilitiesMain")
                        => _resourcesHelper.GetResourceType<DisabilitiesMainResources>(language, siteMapPage),
                    "Advising" when siteMapPage.IdPage.Equals("ManageAdvisees")
                        => _resourcesHelper.GetResourceTypeWithLayout<ManageAdviseesViewResources>(language, siteMapPage),
                    "Advising" when siteMapPage.IdPage.Equals("AdviseeProfile")
                        => _resourcesHelper.GetResourceTypeWithLayout<AdviseeProfileResources>(language, siteMapPage),
                    "Advising" when siteMapPage.IdPage.Equals("AdvisorApproval")
                        => _resourcesHelper.GetUnionResourceType<AdvisorApprovalResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "SectionDetailModal"),
                            new DynamicValue("Generic", "RegistrationSummaryModal"),
                            new DynamicValue("Shared", "StudentCourseStatus"),
                            new DynamicValue("Shared", "StudentCourseMessages")),
                    "Advising" when siteMapPage.IdPage.Equals("AuthorizeAdvisees")
                        => _resourcesHelper.GetResourceTypeWithLayout<AuthorizeAdviseesResources>(language, siteMapPage),
                    "Advising" when siteMapPage.IdPage.Equals("SharedAdvisees")
                        => _resourcesHelper.GetResourceTypeWithLayout<SharedAdviseesResources>(language, siteMapPage),
                    "Advising" when siteMapPage.IdPage.Equals("TestScoresMain")
                        => _resourcesHelper.GetResourceType<TestScoresMainResources>(language, siteMapPage),
                    "Advising" when siteMapPage.IdPage.Equals("AttendanceMain")
                        => _resourcesHelper.GetUnionResourceType<AttendanceResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "SectionDetailModal")),
                    "Advising" when siteMapPage.IdPage.Equals("AlertReportMain")
                        => _resourcesHelper.GetUnionResourceType<AlertReportResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "SectionDetailModal")),

                    #endregion Advising

                    #region Checklist

                    "Checklist" when siteMapPage.IdPage.Equals("MyTasks")
                        => _resourcesHelper.GetResourceTypeWithLayout<MyTasksResources>(language, siteMapPage),
                    "Checklist" when siteMapPage.IdPage.Equals("MyTasksMain")
                         => _resourcesHelper.GetResourceTypeWithLayout<MyTasksMainResources>(language, siteMapPage),

                    #endregion Checklist

                    #region Classes

                    "Classes" when siteMapPage.IdPage.Equals("FacultySchedule")
                        => _resourcesHelper.GetUnionResourceType<FacultyScheduleResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Layout"),
                            new DynamicValue("Generic", "Print"),
                            new DynamicValue("Generic", "SectionDetailModal")),
                    "Classes" when siteMapPage.IdPage.Equals("FacultyCourseManagement")
                        => _resourcesHelper.GetResourceTypeWithLayout<FacultyCourseManagementResources>(language, siteMapPage),
                    "Classes" when siteMapPage.IdPage.Equals("CourseManagementMain")
                        => _resourcesHelper.GetUnionResourceType<CourseManagementMainResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "SectionDetailModal")),
                    "Classes" when siteMapPage.IdPage.Equals("ManageAssistants")
                        => _resourcesHelper.GetResourceType<ManageAssistantsResources>(language, siteMapPage),
                    "Classes" when siteMapPage.IdPage.Equals("ClassList")
                        => _resourcesHelper.GetUnionResourceType<ClassListResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Print")),
                    "Classes" when siteMapPage.IdPage.Equals("Waitlist")
                        => _resourcesHelper.GetResourceType<WaitlistResources>(language, siteMapPage),
                    "Classes" when siteMapPage.IdPage.Equals("PermissionRequests")
                        => _resourcesHelper.GetUnionResourceType<PermissionRequestsResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Shared", "PermissionRequestStatus")),
                    "Classes" when siteMapPage.IdPage.Equals("ActivitiesSetup")
                        => _resourcesHelper.GetResourceType<ActivitiesSetupResources>(language, siteMapPage),
                    "Classes" when siteMapPage.IdPage.Equals("GradeMappings")
                        => _resourcesHelper.GetResourceType<GradeMappingsResources>(language, siteMapPage),
                    "Classes" when siteMapPage.IdPage.Equals("ActivityGrades")
                        => _resourcesHelper.GetResourceType<Models.ResourcesTypes.Classes.ActivityGradesResources>(language, siteMapPage),
                    "Classes" when siteMapPage.IdPage.Equals("Attendance")
                        => _resourcesHelper.GetResourceType<AttendanceResources>(language, siteMapPage),
                    "Classes" when siteMapPage.IdPage.Equals("DailyAttendance")
                        => _resourcesHelper.GetResourceType<DailyAttendanceResources>(language, siteMapPage),
                    "Classes" when siteMapPage.IdPage.Equals("OverallGrades")
                         => _resourcesHelper.GetResourceType<OverallGradesResources>(language, siteMapPage),
                    "Classes" when siteMapPage.IdPage.Equals("Alerts")
                        => _resourcesHelper.GetResourceType<AlertsResources>(language, siteMapPage),

                    #endregion Classes

                    #region Continuing Education

                    "ContinuingEducation" when siteMapPage.IdPage.Equals("ConEdCourses")
                        => _resourcesHelper.GetUnionResourceType<ConEdCoursesResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Layout"),
                            new DynamicValue("Generic", "SectionDetailModal"),
                            new DynamicValue("Shared", "PermissionRequestStatus"),
                            new DynamicValue("Shared", "StudentCourseStatus"),
                            new DynamicValue("Shared", "StudentCourseMessages")),

                    #endregion Continuing Education

                    #region Department

                    "Department" when siteMapPage.IdPage.Equals("CourseManagement")
                        => _resourcesHelper.GetResourceTypeWithLayout<CourseManagementResources>(language, siteMapPage),
                    "Department" when siteMapPage.IdPage.Equals("SetupApprovals")
                        => _resourcesHelper.GetUnionResourceType<SetupApprovalsResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Layout"),
                            new DynamicValue("Generic", "SectionDetailModal")),
                    "Department" when siteMapPage.IdPage.Equals("ApproveGrades")
                        => _resourcesHelper.GetUnionResourceType<ApproveGradesResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Layout"),
                            new DynamicValue("Generic", "SectionDetailModal")),
                    "Department" when siteMapPage.IdPage.Equals("CourseTemplates")
                        => _resourcesHelper.GetUnionResourceType<CourseTemplatesResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Layout"),
                            new DynamicValue("Generic", "SectionDetailModal")),

                    #endregion Department

                    #region Errors

                    "Errors" when siteMapPage.IdPage.Equals("Error400")
                        || siteMapPage.IdPage.Equals("Error401")
                        || siteMapPage.IdPage.Equals("Error403")
                        || siteMapPage.IdPage.Equals("Error404")
                        || siteMapPage.IdPage.Equals("Error500")
                        || siteMapPage.IdPage.Equals("Error503")
                        || siteMapPage.IdPage.Equals("ExpiredInvitation")
                        || siteMapPage.IdPage.Equals("InvalidInvitation")
                        || siteMapPage.IdPage.Equals("InvalidToken")
                            => _resourcesHelper.GetResourceTypeWithLayout<SpecifcErrorResources>(language, siteMapPage),

                    #endregion Errors

                    #region Finances

                    "Finances" when siteMapPage.IdPage.Equals("Balance")
                        => _resourcesHelper.GetResourceTypeWithLayout<BalanceResources>(language, siteMapPage),
                    "Finances" when siteMapPage.IdPage.Equals("BalanceMain")
                        => _resourcesHelper.GetResourceTypeWithLayout<BalanceMainResources>(language, siteMapPage),
                    "Finances" when siteMapPage.IdPage.Equals("FinancialAid")
                        => _resourcesHelper.GetResourceTypeWithLayout<FinancialAidClassResources>(language, siteMapPage),
                    "Finances" when siteMapPage.IdPage.Equals("FinancialAidMain")
                        => _resourcesHelper.GetResourceTypeWithLayout<FinancialAidMainResources>(language, siteMapPage),
                    "Finances" when siteMapPage.IdPage.Equals("Form1098T")
                        => _resourcesHelper.GetResourceTypeWithLayout<Form1098TResources>(language, siteMapPage),
                    "Finances" when siteMapPage.IdPage.Equals("Statement")
                        => _resourcesHelper.GetUnionResourceType<StatementResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Print")),

                    #endregion Finances

                    #region General

                    "General" when siteMapPage.IdPage.Equals("UICulture")
                        => _resourcesHelper.GetResourceType<UICultureResources>(language, siteMapPage),

                    #endregion General

                    #region Generic

                    "Generic" when siteMapPage.IdPage.Equals("AgreementModal")
                        => _resourcesHelper.GetResourceType<AgreementModalResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("CompleteProfileModal")
                        => _resourcesHelper.GetResourceType<CompleteProfileModalResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("Dossier")
                        => _resourcesHelper.GetUnionResourceType<DossierResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "SectionDetailModal"),
                            new DynamicValue("Shared", "StudentCourseStatus"),
                            new DynamicValue("Shared", "StudentCourseMessages")),
                    "Generic" when siteMapPage.IdPage.Equals("DownloadModal")
                    => _resourcesHelper.GetResourceType<DownloadModalResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("FailedPaymentModal")
                    => _resourcesHelper.GetResourceType<FailedPaymentModalResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("Layout")
                    => _resourcesHelper.GetResourceType<LayoutResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("PasswordConfirmation")
                    => _resourcesHelper.GetResourceType<PasswordConfirmationResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("PaymentDetailModal")
                        => _resourcesHelper.GetUnionResourceType<PaymentDetailModalResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Print")),
                    "Generic" when siteMapPage.IdPage.Equals("ProcessPaymentModal")
                        => _resourcesHelper.GetResourceType<ProcessPaymentModalResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("StopList")
                        => _resourcesHelper.GetResourceType<StopListResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("SuccessfulPaymentModal")
                        => _resourcesHelper.GetResourceType<SuccessfulPaymentModalResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("PeopleSearch")
                        => _resourcesHelper.GetResourceType<PeopleSearchResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("PeopleSearchAssignModal")
                        => _resourcesHelper.GetResourceType<PeopleSearchAssignModalResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("SignIn")
                        => _resourcesHelper.GetResourceType<SignInResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("SignUp")
                        => _resourcesHelper.GetResourceType<SignUpResources>(language, siteMapPage),
                    "Generic" when siteMapPage.IdPage.Equals("EmailModal")
                        => _resourcesHelper.GetResourceType<EmailModalResources>(language, siteMapPage),
                    "Grades" when siteMapPage.IdPage.Equals("GradeReport")
                        => _resourcesHelper.GetResourceTypeWithLayout<Models.ResourcesTypes.Grades.GradeReportResources>(language, siteMapPage),

                    #endregion Generic

                    #region Grades

                    "Grades" when siteMapPage.IdPage.Equals("GradeReportMain")
                        => _resourcesHelper.GetUnionResourceType<GradeReportMainResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Print"),
                            new DynamicValue("Generic", "SectionDetailModal")),
                    "Grades" when siteMapPage.IdPage.Equals("UnofficialTranscript")
                        => _resourcesHelper.GetResourceTypeWithLayout<UnofficialTranscriptResources>(language, siteMapPage),
                    "Grades" when siteMapPage.IdPage.Equals("UnofficialTranscriptMain")
                        => _resourcesHelper.GetUnionResourceType<UnofficialTranscriptMainResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Print")),
                    "Grades" when siteMapPage.IdPage.Equals("RequestTranscript")
                        => _resourcesHelper.GetResourceTypeWithLayout<RequestTranscriptResources>(language, siteMapPage),
                    "Grades" when siteMapPage.IdPage.Equals("AlertReport")
                        => _resourcesHelper.GetUnionResourceType<AlertReportResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "SectionDetailModal")),
                    "Grades" when siteMapPage.IdPage.Equals("AttendanceReport")
                        => _resourcesHelper.GetResourceTypeWithLayout<AttendanceReportResources>(language, siteMapPage),

                    #endregion Grades

                    #region Home

                    "Home" when siteMapPage.IdPage.Equals("AccountConfirmation")
                        => _resourcesHelper.GetResourceTypeWithLayout<AccountConfirmationResources>(language, siteMapPage),
                    "Home" when siteMapPage.IdPage.Equals("Dashboard")
                        => _resourcesHelper.GetResourceTypeWithLayout<DashboardResources>(language, siteMapPage),
                    "Home" when siteMapPage.IdPage.Equals("DashboardMessages")
                        => _resourcesHelper.GetResourceType<Models.ResourcesTypes.Home.DashboardMessagesResources>(language, siteMapPage),
                    "Home" when siteMapPage.IdPage.Equals("LogIn")
                        => _resourcesHelper.GetResourceTypeWithLayout<LogInResources>(language, siteMapPage),
                    "Home" when siteMapPage.IdPage.Equals("RecoverPassword")
                        => _resourcesHelper.GetResourceTypeWithLayout<RecoverPasswordResources>(language, siteMapPage),
                    "Home" when siteMapPage.IdPage.Equals("SignOutConfirmation")
                        => _resourcesHelper.GetResourceTypeWithLayout<SignOutConfirmationResources>(language, siteMapPage),

                    #endregion Home

                    #region MakeGift

                    "MakeGift" when siteMapPage.IdPage.Equals("MakeGift")
                        => _resourcesHelper.GetResourceTypeWithLayout<MakeGiftResources>(language, siteMapPage),
                    "MakeGift" when siteMapPage.IdPage.Equals("PersonalInformationModal")
                         => _resourcesHelper.GetResourceType<PersonalInformationModalResources>(language, siteMapPage),

                    #endregion MakeGift

                    #region Planning

                    "Planning" when siteMapPage.IdPage.Equals("DegreeRequirements")
                        => _resourcesHelper.GetUnionResourceType<DegreeRequirementsResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Layout"),
                            new DynamicValue("Generic", "CourseDetailModal"),
                            new DynamicValue("Generic", "CoursePopOver"),
                            new DynamicValue("Generic", "CoursesModal"),
                            new DynamicValue("Generic", "SectionDetailModal"),
                            new DynamicValue("Generic", "SectionSearchModal")),
                    "Planning" when siteMapPage.IdPage.Equals("TransferCourseEquivalencies")
                        => _resourcesHelper.GetUnionResourceType<TransferCourseEquivalenciesResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "CourseDetailModal")),

                    #endregion Planning

                    #region Registration

                    "Registration" when siteMapPage.IdPage.Equals("AcademicPlan")
                        => _resourcesHelper.GetResourceTypeWithLayout<AcademicPlanResources>(language, siteMapPage),
                    "Registration" when siteMapPage.IdPage.Equals("AcademicPlanMain")
                        => _resourcesHelper.GetUnionResourceType<AcademicPlanMainResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "CourseDetailModal"),
                            new DynamicValue("Generic", "CoursePopOver"),
                            new DynamicValue("Generic", "CoursesModal"),
                            new DynamicValue("Generic", "Print"),
                            new DynamicValue("Generic", "SectionDetailModal"),
                            new DynamicValue("Generic", "SectionSearchModal")),
                    "Registration" when siteMapPage.IdPage.Equals("Courses")
                        => _resourcesHelper.GetUnionResourceType<CoursesResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Layout"),
                            new DynamicValue("Generic", "RegistrationSummaryModal"),
                            new DynamicValue("Generic", "SectionCard"),
                            new DynamicValue("Generic", "SectionDetailModal"),
                            new DynamicValue("Shared", "PermissionRequestStatus"),
                            new DynamicValue("Shared", "RegistrationPeriodStatus"),
                            new DynamicValue("Shared", "StudentCourseStatus"),
                            new DynamicValue("Shared", "StudentCourseMessages")),
                    "Registration" when siteMapPage.IdPage.Equals("Schedule")
                        => _resourcesHelper.GetResourceTypeWithLayout<ScheduleResources>(language, siteMapPage),
                    "Registration" when siteMapPage.IdPage.Equals("StudentSchedule")
                        => _resourcesHelper.GetUnionResourceType<StudentScheduleResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "SectionDetailModal"),
                            new DynamicValue("Generic", "Print"),
                            new DynamicValue("Shared", "PermissionRequestStatus"),
                            new DynamicValue("Shared", "StudentCourseStatus"),
                            new DynamicValue("Shared", "StudentCourseMessages")),
                    "Registration" when siteMapPage.IdPage.Equals("ValidationMessages")
                        => _resourcesHelper.GetResourceType<ValidationMessagesClassResources>(language, siteMapPage),
                    "Registration" when siteMapPage.IdPage.Equals("WhatIf")
                        => _resourcesHelper.GetResourceTypeWithLayout<WhatIfResources>(language, siteMapPage),
                    "Registration" when siteMapPage.IdPage.Equals("WhatIfMain")
                        => _resourcesHelper.GetUnionResourceType<WhatIfMainResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "CourseDetailModal"),
                            new DynamicValue("Generic", "CoursePopOver"),
                            new DynamicValue("Generic", "CoursesModal"),
                            new DynamicValue("Generic", "SectionDetailModal"),
                            new DynamicValue("Generic", "SectionSearchModal")),

                    #endregion Registration

                    #region Search

                    "Search" when siteMapPage.IdPage.Equals("Course")
                        => _resourcesHelper.GetUnionResourceType<CourseResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "Layout"),
                            new DynamicValue("Generic", "CourseDetailModal")),
                    "Search" when siteMapPage.IdPage.Equals("Section")
                        => _resourcesHelper.GetUnionResourceType<SectionResources>(language,
                            new DynamicValue(siteMapPage.IdModule, siteMapPage.IdPage),
                            new DynamicValue("Generic", "SectionCard"),
                            new DynamicValue("Generic", "SectionDetailModal")),

                    #endregion Search

                    #region Shared

                    "Shared" when siteMapPage.IdPage.Equals("MainMenu")
                        => _resourcesHelper.GetResourceType<MainMenuResources>(language, siteMapPage),
                    "Shared" when siteMapPage.IdPage.Equals("StudentCourseStatus")
                        => _resourcesHelper.GetResourceType<StudentCourseStatusResources>(language, siteMapPage),

                    #endregion Shared

                    #region Shared Access

                    "SharedAccess" when siteMapPage.IdPage.Equals("Students")
                        => _resourcesHelper.GetResourceType<StudentsResources>(language, siteMapPage),
                    "SharedAccess" when siteMapPage.IdPage.Equals("StudentProfile")
                         => _resourcesHelper.GetResourceTypeWithLayout<StudentProfileResources>(language, siteMapPage),
                    "SharedAccess" when siteMapPage.IdPage.Equals("StudentProfileMain")
                        => _resourcesHelper.GetResourceType<StudentProfileMainResources>(language, siteMapPage),
                    "SharedAccess" when siteMapPage.IdPage.Equals("StopListMain")
                        => _resourcesHelper.GetResourceType<StopListMainResources>(language, siteMapPage),

                    #endregion Shared Access

                    _ => json,
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(LayoutController).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Gets the URL parameters match.
        /// </summary>
        /// <param name="match">The match.</param>
        /// <returns></returns>
        private string GetUrlParametersMatch(Match match)
        {
            string value = string.Empty;
            if (Account != null && match != null && !string.IsNullOrEmpty(match.Value))
            {
                switch (match.Value)
                {
                    case "%peopleCodeId%":
                        if (!string.IsNullOrEmpty(Account.PeopleCodeId))
                            value = Account.PeopleCodeId;
                        break;

                    case "%peopleId%":
                        if (!string.IsNullOrEmpty(Account.PeopleId))
                            value = Account.PeopleId;
                        break;

                    case "%personId%":
                        if (Account.PersonId > 0)
                            value = Account.PersonId.ToString();
                        break;

                    case "%userName%":
                        if (!string.IsNullOrEmpty(Account.UserName))
                            value = Account.UserName;
                        break;

                    case "%email%":
                        if (!string.IsNullOrEmpty(Account.Email))
                            value = Account.Email;
                        break;

                    default:
                        break;
                }
            }
            return WebUtility.UrlEncode(value);
        }

        /// <summary>
        /// Endpoint to get the sitemap for the menu.
        /// </summary>
        /// <param name="texts">The texts.</param>
        /// <param name="urls">The urls.</param>
        /// <returns>
        /// List(MenuOptionViewModel)&gt;
        /// </returns>
        private List<MenuOptionViewModel> SiteMapToMenu(List<MenuResources> texts, List<MenuSiteMap> urls)
        {
            List<MenuOptionViewModel> options = new();
            try
            {
                foreach (MenuSiteMap urlItem in urls)
                {
                    string defaultItemUrl = "#";
                    string itemUrl = string.Empty;
                    string itemText = string.Empty;
                    if (urlItem.IsCustom)
                    {
                        itemUrl = urlItem.ExternalLink;
                        itemText = urlItem.Id;
                    }
                    else
                    {
                        MenuResources textFound = texts.Find(t => t.Id == urlItem.Id);
                        if (textFound != null)
                            itemText = textFound.Text;

                        itemUrl = Url.RouteUrl(urlItem.Id);
                        if (itemUrl == null)
                            itemUrl = defaultItemUrl;
                    }

                    options.Add(new MenuOptionViewModel
                    {
                        Id = urlItem.Id,
                        Url = itemUrl,
                        Text = itemText,
                        SiteMapId = urlItem.SiteMapId,
                        IsCustom = urlItem.IsCustom,
                        IsVisible = urlItem.Visible
                    });
                }

                return options;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(LayoutController).FullName, exception.Message, exception);
                return options;
            }
        }

        #endregion Private Methods
    }
}