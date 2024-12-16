// --------------------------------------------------------------------
// <copyright file="Startup.cs" company="Ellucian">
//     Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.DataAccess;
using Hedtech.PowerCampus.Administration.Interfaces.DataAccess;
using Hedtech.PowerCampus.Administration.Interfaces.Services;
using Hedtech.PowerCampus.Administration.Logic;
using Hedtech.PowerCampus.Administration.Models;
using Hedtech.PowerCampus.Administration.Models.Settings;
using Hedtech.PowerCampus.Administration.Services;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.DataAccess;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Core.Logic;
using Hedtech.PowerCampus.Core.Services;
using Hedtech.PowerCampus.Infrastructure.DataAccess;
using Hedtech.PowerCampus.Logger;
using ITfoxtec.Identity.Saml2.MvcCore.Configuration;
using ITfoxtec.Identity.Saml2.Schemas.Metadata;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SelfService.Authentication;
using SelfService.Helpers;
using SelfService.Helpers.Interfaces;
using Serilog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using AdminApplicationDA = Hedtech.PowerCampus.Administration.DataAccess.ApplicationDA;
using AdminApplicationService = Hedtech.PowerCampus.Administration.Services.ApplicationService;
using ApplicationDA = Hedtech.PowerCampus.Infrastructure.DataAccess.ApplicationDA;
using ApplicationService = Hedtech.PowerCampus.Core.Services.ApplicationService;
using IAdminApplicationDA = Hedtech.PowerCampus.Administration.Interfaces.DataAccess.IApplicationDA;
using IAdminApplicationService = Hedtech.PowerCampus.Administration.Interfaces.Services.IApplicationService;
using IApplicationDA = Hedtech.PowerCampus.Core.Interfaces.DataAccess.IApplicationDA;
using IApplicationService = Hedtech.PowerCampus.Core.Interfaces.Services.IApplicationService;

namespace SelfService
{
    /// <summary>
    /// Startup
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Startup" /> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        /// <param name="environment">The environment.</param>
        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        /// <summary>
        /// Gets the configuration.
        /// </summary>
        /// <value>
        /// The configuration.
        /// </value>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// Gets the environment.
        /// </summary>
        /// <value>
        /// The environment.
        /// </value>
        public IWebHostEnvironment Environment { get; }

        /// <summary>
        /// Configures the specified application.
        /// </summary>
        /// <param name="app">The application.</param>
        /// <param name="siteConfigurationHelper">The site configuration helper.</param>
        /// <param name="webHostEnvironment">The web host environment.</param>
        /// <param name="loggerFactory">The logger factory.</param>
        public void Configure(
            IApplicationBuilder app,
            ISiteConfigurationHelper siteConfigurationHelper,
            IWebHostEnvironment webHostEnvironment,
            IAppLogger<Startup> loggerFactory)
        {
            app.UseForwardedHeaders();

            if (webHostEnvironment.IsDevelopment())
            {
                loggerFactory.Initialize("appsettings.Development");
                app.UseDeveloperExceptionPage();
            }
            else
            {
                loggerFactory.Initialize("appsettings");
                app.UseExceptionHandler("/Errors/Error");
            }

            app.UseStaticFiles();

            app.UseRouting();

            app.MapWhen(context =>
            {
                return context.GetRouteData()?.Values["controller"] != null
                    && context.GetRouteData().Values["controller"].ToString() != "Layout"
                    && context.GetRouteData().Values["controller"].ToString() != "Errors"
                    && siteConfigurationHelper.IsConfigurationMissing;
            }, HandleMissingConfiguration);

            app.MapWhen(context => !string.IsNullOrEmpty(context.Request.Query["ticket"]), app => app.UsePortalAuthentication());

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSession();

            app.UseEndpoints(endpoints =>
            {
                #region Administration routes

                endpoints.MapControllerRoute(
                        name: "ConEdSetupId",
                        pattern: "Administration/ConEdSetup",
                        defaults: new { controller = "Administration", action = "ConEdSetup" }
                    );

                endpoints.MapControllerRoute(
                        name: "FormsSetupId",
                        pattern: "Administration/FormsSetup",
                        defaults: new { controller = "Administration", action = "FormsSetup" }
                    );

                endpoints.MapControllerRoute(
                        name: "GeneralSetupId",
                        pattern: "Administration/GeneralSetup",
                        defaults: new { controller = "Administration", action = "GeneralSetup" }
                    );

                endpoints.MapControllerRoute(
                        name: "InstructorSetupId",
                        pattern: "Administration/InstructorSetup",
                        defaults: new { controller = "Administration", action = "InstructorSetup" }
                    );

                endpoints.MapControllerRoute(
                        name: "NotificationsSetupId",
                        pattern: "Administration/NotificationsSetup",
                        defaults: new { controller = "Administration", action = "NotificationsSetup" }
                    );

                endpoints.MapControllerRoute(
                        name: "ProfileSetupId",
                        pattern: "Administration/ProfileSetup",
                        defaults: new { controller = "Administration", action = "ProfileSetup" }
                    );

                endpoints.MapControllerRoute(
                        name: "RequestsSetupId",
                        pattern: "Administration/RequestsSetup",
                        defaults: new { controller = "Administration", action = "RequestsSetup" }
                    );

                endpoints.MapControllerRoute(
                        name: "StudentSetupId",
                        pattern: "Administration/StudentSetup",
                        defaults: new { controller = "Administration", action = "StudentSetup" }
                    );

                endpoints.MapControllerRoute(
                        name: "WebsiteSetupId",
                        pattern: "Administration/WebsiteSetup",
                        defaults: new { controller = "Administration", action = "WebsiteSetup" }
                    );

                endpoints.MapControllerRoute(
                        name: "DonationsSetupId",
                        pattern: "Administration/DonationsSetup",
                        defaults: new { controller = "Administration", action = "DonationsSetup" }
                    );

                #endregion Administration routes

                #region Admissions routes

                endpoints.MapControllerRoute(
                        name: "ApplicationsId",
                        pattern: "Admissions/Applications",
                        defaults: new { controller = "Admissions", action = "Applications" }
                    );

                endpoints.MapControllerRoute(
                        name: "InquiriesId",
                        pattern: "Admissions/Inquiries",
                        defaults: new { controller = "Admissions", action = "Inquiries" }
                    );

                #endregion Admissions routes

                #region Advising routes

                endpoints.MapControllerRoute(
                        name: "ManageAdviseesId",
                        pattern: "Advising/ManageAdvisees",
                        defaults: new { controller = "Advising", action = "ManageAdvisees" }
                    );

                endpoints.MapControllerRoute(
                        name: "AuthorizeAdviseesId",
                        pattern: "Advising/AuthorizeAdvisees",
                        defaults: new { controller = "Advising", action = "AuthorizeAdvisees" }
                    );

                endpoints.MapControllerRoute(
                        name: "SharedAdviseesId",
                        pattern: "Advising/SharedAdvisees",
                        defaults: new { controller = "Advising", action = "SharedAdvisees" }
                    );

                #endregion Advising routes

                #region Classes routes

                endpoints.MapControllerRoute(
                        name: "FacultyScheduleId",
                        pattern: "Classes/Schedule",
                        defaults: new { controller = "Classes", action = "Schedule" }
                    );

                endpoints.MapControllerRoute(
                        name: "FacultyCourseManagementId",
                        pattern: "Classes/CourseManagement",
                        defaults: new { controller = "Classes", action = "CourseManagement" }
                    );

                #endregion Classes routes

                #region Continuing Education routes

                endpoints.MapControllerRoute(
                        name: "ConEdCoursesId",
                        pattern: "ContinuingEducation/ConEdCourses",
                        defaults: new { controller = "ContinuingEducation", action = "ConEdCourses" }
                    );

                #endregion Continuing Education routes

                #region Checklist

                endpoints.MapControllerRoute(
                        name: "MyTasksId",
                        pattern: "Checklist/MyTasks",
                        defaults: new { controller = "Checklist", action = "MyTasks" }
                    );

                #endregion Checklist

                #region Department routes

                endpoints.MapControllerRoute(
                        name: "CourseManagementId",
                        pattern: "Department/CourseManagement",
                        defaults: new { controller = "Department", action = "CourseManagement" }
                    );

                endpoints.MapControllerRoute(
                        name: "SetupApprovalsId",
                        pattern: "Department/SetupApprovals",
                        defaults: new { controller = "Department", action = "SetupApprovals" }
                    );

                endpoints.MapControllerRoute(
                        name: "ApproveGradesId",
                        pattern: "Department/ApproveGrades",
                        defaults: new { controller = "Department", action = "ApproveGrades" }
                    );

                endpoints.MapControllerRoute(
                        name: "CourseTemplatesId",
                        pattern: "Department/CourseTemplates",
                        defaults: new { controller = "Department", action = "CourseTemplates" }
                    );

                #endregion Department routes

                #region Donations

                endpoints.MapControllerRoute(
                    name: "MakeGiftId",
                    pattern: "MakeGift",
                    defaults: new { controller = "MakeGift", action = "MakeGift" }
                );

                #endregion Donations

                #region Finances routes

                endpoints.MapControllerRoute(
                        name: "BalanceId",
                        pattern: "Finances/Balance",
                        defaults: new { controller = "Finances", action = "Balance" }
                    );

                endpoints.MapControllerRoute(
                        name: "StatementId",
                        pattern: "Finances/Statement",
                        defaults: new { controller = "Finances", action = "Statement" }
                    );

                endpoints.MapControllerRoute(
                        name: "FinancialAidId",
                        pattern: "Finances/FinancialAid",
                        defaults: new { controller = "Finances", action = "FinancialAid" }
                    );

                endpoints.MapControllerRoute(
                        name: "Form1098TId",
                        pattern: "Finances/Form1098T",
                        defaults: new { controller = "Finances", action = "Form1098T" }
                    );

                #endregion Finances routes

                #region Grades routes

                endpoints.MapControllerRoute(
                        name: "UnofficialTranscriptId",
                        pattern: "Grades/UnofficialTranscript",
                        defaults: new { controller = "Grades", action = "UnofficialTranscript" }
                    );

                endpoints.MapControllerRoute(
                        name: "GradeReportId",
                        pattern: "Grades/GradeReport",
                        defaults: new { controller = "Grades", action = "GradeReport" }
                    );

                endpoints.MapControllerRoute(
                        name: "RequestTranscriptId",
                        pattern: "Grades/RequestTranscript",
                        defaults: new { controller = "Grades", action = "RequestTranscript" }
                    );

                endpoints.MapControllerRoute(
                        name: "AlertReportId",
                        pattern: "Grades/AlertReport",
                        defaults: new { controller = "Grades", action = "AlertReport" }
                    );

                endpoints.MapControllerRoute(
                        name: "AttendanceReportId",
                        pattern: "Grades/AttendanceReport",
                        defaults: new { controller = "Grades", action = "AttendanceReport" }
                    );

                #endregion Grades routes

                #region Planning routes

                endpoints.MapControllerRoute(
                        name: "DegreeRequirementsId",
                        pattern: "Planning/DegreeRequirements",
                        defaults: new { controller = "Planning", action = "DegreeRequirements" }
                    );

                endpoints.MapControllerRoute(
                        name: "TransferCourseEquivalenciesId",
                        pattern: "Planning/TransferCourse",
                        defaults: new { controller = "Planning", action = "TransferCourse" }
                    );

                #endregion Planning routes

                #region Registration routes

                endpoints.MapControllerRoute(
                    name: "AcademicPlanId",
                    pattern: "Registration/AcademicPlan",
                    defaults: new { controller = "Registration", action = "AcademicPlan" }
                );

                endpoints.MapControllerRoute(
                        name: "CoursesId",
                        pattern: "Registration/Courses",
                        defaults: new { controller = "Registration", action = "Courses" }
                    );

                endpoints.MapControllerRoute(
                    name: "ScheduleId",
                    pattern: "Registration/Schedule",
                    defaults: new { controller = "Registration", action = "Schedule" }
                );

                endpoints.MapControllerRoute(
                    name: "WhatIfId",
                    pattern: "Registration/WhatIf",
                    defaults: new { controller = "Registration", action = "WhatIf" }
                );

                #endregion Registration routes

                #region Search routes

                endpoints.MapControllerRoute(
                    name: "CourseSearchId",
                    pattern: "Search/Course",
                    defaults: new { controller = "Search", action = "Course" }
                );

                endpoints.MapControllerRoute(
                    name: "SectionSearchId",
                    pattern: "Search/Section",
                    defaults: new { controller = "Search", action = "Section" }
                );

                #endregion Search routes

                #region Shared Access routes

                endpoints.MapControllerRoute(
                    name: "StudentsId",
                    pattern: "SharedAccess/Students",
                    defaults: new { controller = "SharedAccess", action = "Students" }
                );

                #endregion Shared Access routes

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}",
                    defaults: new { controller = "Home", action = "Index" }
                );
            });

            app.UseSerilogRequestLogging();
        }

        /// <summary>
        /// Configures the services.
        /// </summary>
        /// <param name="services">The services.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            });

            services.AddOptions();

            #region Configuration Sections

            IConfigurationSection sessionStateSection = Configuration.GetSection("SessionState");
            services.Configure<SessionState>(sessionStateSection);
            SessionState sessionState = sessionStateSection.Get<SessionState>();

            services.Configure<ConnectionStrings>(Configuration.GetSection("ConnectionStrings"));
            services.Configure<AdminConnectionStrings>(Configuration.GetSection("ConnectionStrings"));

            services.Configure<LoginSettings>(Configuration.GetSection("AuthenticationSettings:Login"));

            services.Configure<List<ActiveDirectoryStoreSettings>>(Configuration.GetSection("AuthenticationSettings:ActiveDirectory:Stores"));

            IConfigurationSection adfsStoreSettingsSection = Configuration.GetSection("AuthenticationSettings:ADFS:Stores");
            services.Configure<List<AdfsStoreSettings>>(adfsStoreSettingsSection);
            List<AdfsStoreSettings> adfsStoreSettings = adfsStoreSettingsSection.Get<List<AdfsStoreSettings>>() ?? new();

            services.Configure<List<SamlStoreSettings>>(Configuration.GetSection("AuthenticationSettings:SAML:Stores"));
            services.Configure<List<SamlStoreSettings>>(samlStoreSettings =>
            {
                IServiceScopeFactory scopeFactory = services.BuildServiceProvider().GetRequiredService<IServiceScopeFactory>();

                using IServiceScope scope = scopeFactory.CreateScope();
                IAppLogger<Startup> logger = scope.ServiceProvider.GetRequiredService<IAppLogger<Startup>>();

                if (samlStoreSettings != null)
                {
                    string errorMessage;
                    for (int i = 0; i < samlStoreSettings.Count; i++)
                    {
                        SamlStoreSettings samlStoreSetting = samlStoreSettings[i];
                        try
                        {
                            samlStoreSetting.AllowedAudienceUris.Add(samlStoreSetting.Issuer);

                            EntityDescriptor entityDescriptor = new();
                            string idPMetadataText = Configuration[$"AuthenticationSettings:SAML:Stores:{i}:IdPMetadata"];
                            if (!string.IsNullOrEmpty(idPMetadataText))
                            {
                                Uri IdPMetadataUri = new(Path.Combine(Environment.ContentRootPath, idPMetadataText));
                                entityDescriptor.ReadIdPSsoDescriptorFromUrl(IdPMetadataUri);

                                if (entityDescriptor.IdPSsoDescriptor != null)
                                {
                                    samlStoreSetting.AllowedIssuer = entityDescriptor.EntityId;
                                    samlStoreSetting.SingleSignOnDestination = entityDescriptor.IdPSsoDescriptor.SingleSignOnServices.First().Location;

                                    if (entityDescriptor.IdPSsoDescriptor.SingleLogoutServices?.Count() > 0)
                                        samlStoreSetting.SingleLogoutDestination = entityDescriptor.IdPSsoDescriptor.SingleLogoutServices.First().Location;

                                    samlStoreSetting.SignatureValidationCertificates.AddRange(entityDescriptor.IdPSsoDescriptor.SigningCertificates);

                                    if (entityDescriptor.IdPSsoDescriptor.WantAuthnRequestsSigned.HasValue)
                                        samlStoreSetting.SignAuthnRequest = entityDescriptor.IdPSsoDescriptor.WantAuthnRequestsSigned.Value;
                                }
                                else
                                {
                                    errorMessage = $"SAML Settings ({samlStoreSetting.Name}): IdPSsoDescriptor not loaded from metadata.";
                                    logger.LogError(Constants._product, nameof(Startup), errorMessage);
                                    throw new Exception(errorMessage);
                                }
                            }
                            else
                            {
                                errorMessage = $"SAML Settings ({samlStoreSetting.Name}): IdPMetadata was not configured.";
                                logger.LogError(Constants._product, nameof(Startup), errorMessage);
                                throw new Exception(errorMessage);
                            }
                        }
                        catch (Exception exception)
                        {
                            logger.LogError(Constants._product, nameof(Startup), $"SAML Settings ({samlStoreSetting.Name}): {exception.Message}", exception);
                            throw;
                        }
                    }
                }
            });
            services.AddOptions<CookieAuthenticationOptions>(IdentityConstants.ApplicationScheme)
              .Configure<ITicketStore>((options, store) =>
              {
                  options.SessionStore = store;
              });
            services.AddOptions<CookieAuthenticationOptions>(IdentityConstants.ExternalScheme)
              .Configure<ITicketStore>((options, store) =>
              {
                  options.SessionStore = store;
              });
            services.AddSaml2();

            IConfigurationSection notificationSettingsSection = Configuration.GetSection("NotificationSettings");
            services.Configure<NotificationSettings>(notificationSettingsSection);
            NotificationSettings notificationSettings = notificationSettingsSection.Get<NotificationSettings>();

            #endregion Configuration Sections

            #region Cache

            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.Cookie.Name = Constants._sessionCookieName;
                options.IdleTimeout = TimeSpan.FromMinutes(sessionState.Timeout);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            #endregion Cache

            #region HttpClient

            services.AddHttpClient(Constants._notificationsClient, client =>
            {
                client.BaseAddress = new Uri(notificationSettings.BaseAddress);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", notificationSettings.Token);
            });

            services.AddHttpClient(Constants._reCaptchaClient, client =>
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            });

            #endregion HttpClient

            #region Controllers and Views

            services.AddHttpContextAccessor();
            services.AddControllersWithViews().AddJsonOptions(options =>
                    {
                        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    });

            #endregion Controllers and Views

            #region Hedtech.PowerCampus.Core

            #region Data Access

            services.AddScoped<IAcademicDA, AcademicDA>();
            services.AddScoped<IAcademicDefaultDA, AcademicDefaultDA>();
            services.AddScoped<IAddressDA, AddressDA>();
            services.AddScoped<IAddressRequestDA, AddressRequestDA>();
            services.AddScoped<IAdviseeDA, AdviseeDA>();
            services.AddScoped<IAdvisingDA, AdvisingDA>();
            services.AddScoped<IAgreementDA, AgreementDA>();
            services.AddScoped<IApplicationDA, ApplicationDA>();
            services.AddScoped<IApplicationEducationDA, ApplicationEducationDA>();
            services.AddScoped<IApplicationEducationEnrollmentDA, ApplicationEducationEnrollmentDA>();
            services.AddScoped<IApplicationEmploymentDA, ApplicationEmploymentDA>();
            services.AddScoped<IApplicationOfPaymentDA, ApplicationOfPaymentDA>();
            services.AddScoped<IAssignmentDA, AssignmentDA>();
            services.AddScoped<IAssignmentTemplateDA, AssignmentTemplateDA>();
            services.AddScoped<IAssignmentTypeDA, AssignmentTypeDA>();
            services.AddScoped<IAssociationHeadDA, AssociationHeadDA>();
            services.AddScoped<IAttendanceDA, AttendanceDA>();
            services.AddScoped<IBlockRegistrationDA, BlockRegistrationDA>();
            services.AddScoped<IBlockRegistrationGroupDA, BlockRegistrationGroupDA>();
            services.AddScoped<IBlockRegistrationRuleDA, BlockRegistrationRuleDA>();
            services.AddScoped<ICalendarDA, CalendarDA>();
            services.AddScoped<ICampusCoordinatorDA, CampusCoordinatorDA>();
            services.AddScoped<ICartDA, CartDA>();
            services.AddScoped<ICashReceiptDA, CashReceiptDA>();
            services.AddScoped<IChargeCreditDA, ChargeCreditDA>();
            services.AddScoped<IChecklistDA, ChecklistDA>();
            services.AddScoped<ICodeTableDA, CodeTableDA>();
            services.AddScoped<ICourseDA, CourseDA>();
            services.AddScoped<IDashboardMessageDA, DashboardMessageDA>();
            services.AddScoped<IDegreeDA, DegreeDA>();
            services.AddScoped<IDemographicDA, DemographicDA>();
            services.AddScoped<IDemographicRequestDA, DemographicRequestDA>();
            services.AddScoped<IDepartmentHeadDA, DepartmentHeadDA>();
            services.AddScoped<IDonationDA, DonationDA>();
            services.AddScoped<IDossierDA, DossierDA>();
            services.AddScoped<IFacultyAssistantDA, FacultyAssistantDA>();
            services.AddScoped<IFinanceDA, FinanceDA>();
            services.AddScoped<IFormDA, FormDA>();
            services.AddScoped<IGenderIdentityRequestDA, GenderIdentityRequestDA>();
            services.AddScoped<IGradeActivityDA, GradeActivityDA>();
            services.AddScoped<IGradeApprovalDA, GradeApprovalDA>();
            services.AddScoped<IGradeDA, GradeDA>();
            services.AddScoped<IGradeValueDA, GradeValueDA>();
            services.AddScoped<IInquiryDA, InquiryDA>();
            services.AddScoped<IInquiryFormSettingDA, InquiryFormSettingDA>();
            services.AddScoped<IInstitutionDA, InstitutionDA>();
            services.AddScoped<IInstitutionGradeMappingDA, InstitutionGradeMappingDA>();
            services.AddSingleton<IInstitutionSettingDA, InstitutionSettingDA>();
            services.AddScoped<IInstitutionSettingFilterDA, InstitutionSettingFilterDA>();
            services.AddScoped<IInvitationDA, InvitationDA>();
            services.AddScoped<INameFormatDA, NameFormatDA>();
            services.AddScoped<INotificationDA, NotificationDA>();
            services.AddScoped<IOfficeDA, OfficeDA>();
            services.AddScoped<IOrganizationDA, OrganizationDA>();
            services.AddScoped<IPaymentDA, PaymentDA>();
            services.AddScoped<IPeopleDA, PeopleDA>();
            services.AddScoped<IPeriodDA, PeriodDA>();
            services.AddScoped<IPermissionRequestDA, PermissionRequestDA>();
            services.AddScoped<IPlanningDA, PlanningDA>();
            services.AddScoped<IProgramDA, ProgramDA>();
            services.AddScoped<IRegistrationDA, RegistrationDA>();
            services.AddScoped<IRegistrationGroupDA, RegistrationGroupDA>();
            services.AddScoped<IRegistrationLogDA, RegistrationLogDA>();
            services.AddScoped<IRoleQueueDA, RoleQueueDA>();
            services.AddScoped<ISavedApplicationDA, SavedApplicationDA>();
            services.AddScoped<IScheduleDA, ScheduleDA>();
            services.AddScoped<IScheduleRequestDA, ScheduleRequestDA>();
            services.AddScoped<ISectionDA, SectionDA>();
            services.AddScoped<ISectionGradeMappingDA, SectionGradeMappingDA>();
            services.AddSingleton<ISettingDA, SettingDA>();
            services.AddScoped<ISiteMapDA, SiteMapDA>();
            services.AddScoped<ISsoDA, SsoDA>();
            services.AddScoped<IStudentAssignmentDA, StudentAssignmentDA>();
            services.AddScoped<IStudentDA, StudentDA>();
            services.AddScoped<IStudentSectionAttendanceDA, StudentSectionAttendanceDA>();
            services.AddScoped<ITaxYearDA, TaxYearDA>();
            services.AddScoped<ITemporaryUserDA, TemporaryUserDA>();
            services.AddScoped<ITransactionDA, TransactionDA>();
            services.AddScoped<ITranscriptDetailDA, TranscriptDetailDA>();
            services.AddScoped<ITranscriptGradeDA, TranscriptGradeDA>();
            services.AddScoped<ITranscriptRequestDA, TranscriptRequestDA>();
            services.AddScoped<ITransferCatalogDA, TransferCatalogDA>();
            services.AddScoped<IViolationDA, ViolationDA>();
            services.AddScoped<IWaitListDA, WaitListDA>();
            services.AddScoped<IWhatIfDA, WhatIfDA>();

            #endregion Data Access

            #region Services

            services.AddScoped<IAcademicDefaultService, AcademicDefaultService>();
            services.AddScoped<IAcademicService, AcademicService>();
            services.AddScoped<IAddressRequestService, AddressRequestService>();
            services.AddScoped<IAddressService, AddressService>();
            services.AddScoped<IAdviseeService, AdviseeService>();
            services.AddScoped<IAdviseeWarningService, AdviseeWarningService>();
            services.AddScoped<IAdvisingService, AdvisingService>();
            services.AddScoped<IAgreementService, AgreementService>();
            services.AddScoped<IApplicationService, ApplicationService>();
            services.AddScoped<IAssignmentService, AssignmentService>();
            services.AddScoped<IAssignmentTemplateService, AssignmentTemplateService>();
            services.AddScoped<IAssociationHeadService, AssociationHeadService>();
            services.AddScoped<IAttendanceService, AttendanceService>();
            services.AddScoped<IBlockRegistrationGroupService, BlockRegistrationGroupService>();
            services.AddScoped<IBlockRegistrationRuleService, BlockRegistrationRuleService>();
            services.AddScoped<IBlockRegistrationService, BlockRegistrationService>();
            services.AddScoped<ICampusCoordinatorService, CampusCoordinatorService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<ICashReceiptService, CashReceiptService>();
            services.AddScoped<IChargeCreditService, ChargeCreditService>();
            services.AddScoped<IChecklistService, ChecklistService>();
            services.AddScoped<ICodeTableService, CodeTableService>();
            services.AddScoped<IDashboardMessageService, DashboardMessageService>();
            services.AddScoped<IDegreeService, DegreeService>();
            services.AddScoped<IDemographicRequestService, DemographicRequestService>();
            services.AddScoped<IDepartmentHeadService, DepartmentHeadService>();
            services.AddScoped<IDepartmentService, DepartmentService>();
            services.AddScoped<IDonationService, DonationService>();
            services.AddScoped<IDossierService, DossierService>();
            services.AddScoped<IFacultyAssistantService, FacultyAssistantService>();
            services.AddScoped<IFinanceService, FinanceService>();
            services.AddScoped<IFormService, FormService>();
            services.AddScoped<IGenderIdentityRequestService, GenderIdentityRequestService>();
            services.AddScoped<IGradeActivityService, GradeActivityService>();
            services.AddScoped<IGradeService, GradeService>();
            services.AddScoped<IInquiryService, InquiryService>();
            services.AddScoped<IInstitutionGradeMappingService, InstitutionGradeMappingService>();
            services.AddScoped<IInstitutionService, InstitutionService>();
            services.AddScoped<IInstitutionSettingFilterService, InstitutionSettingFilterService>();
            services.AddSingleton<IInstitutionSettingService, InstitutionSettingService>();
            services.AddScoped<IInvitationService, InvitationService>();
            services.AddScoped<INameFormatService, NameFormatService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IOfficeService, OfficeService>();
            services.AddScoped<IOrganizationService, OrganizationService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IPeopleService, PeopleService>();
            services.AddScoped<IPeriodService, PeriodService>();
            services.AddScoped<IPermissionRequestService, PermissionRequestService>();
            services.AddScoped<IPlanningService, PlanningService>();
            services.AddScoped<IProgramService, ProgramService>();
            services.AddScoped<IRegistrationGroupService, RegistrationGroupService>();
            services.AddScoped<IRegistrationService, RegistrationService>();
            services.AddScoped<IRoleQueueService, RoleQueueService>();
            services.AddScoped<IScheduleRequestService, ScheduleRequestService>();
            services.AddScoped<IScheduleService, ScheduleService>();
            services.AddScoped<ISearchService, SearchService>();
            services.AddScoped<ISectionGradeMappingService, SectionGradeMappingService>();
            services.AddScoped<ISectionService, SectionService>();
            services.AddScoped<ISettingService, SettingService>();
            services.AddScoped<ISiteMapService, SiteMapService>();
            services.AddScoped<ISsoService, SsoService>();
            services.AddScoped<ITaxYearService, TaxYearService>();
            services.AddScoped<ITemporaryUserService, TemporaryUserService>();
            services.AddScoped<ITranscriptRequestService, TranscriptRequestService>();
            services.AddScoped<ITransferCatalogService, TransferCatalogService>();
            services.AddScoped<IViolationService, ViolationService>();
            services.AddScoped<IWaitListService, WaitListService>();
            services.AddScoped<IWhatIfService, WhatIfService>();

            #endregion Services

            #region Logic

            services.AddScoped<GradeEvaluator>();
            services.AddScoped<AssignmentTemplateValidator>();

            #endregion Logic

            #endregion Hedtech.PowerCampus.Core

            #region Hedtech.PowerCampus.Administration

            #region Data Access

            services.AddScoped<IAppAreaCreationModeDA, AppAreaCreationModeDA>();
            services.AddScoped<IAppAreaDA, AppAreaDA>();
            services.AddScoped<IAppCatalogDA, AppCatalogDA>();
            services.AddScoped<IAppClaimDA, AppClaimDA>();
            services.AddScoped<IAdminApplicationDA, AdminApplicationDA>();
            services.AddScoped<IAppPasswordHistoryDA, AppPasswordHistoryDA>();
            services.AddScoped<IAppPasswordPolicyDA, AppPasswordPolicyDA>();
            services.AddScoped<IAppPasswordRecoveryRequestDA, AppPasswordRecoveryRequestDA>();
            services.AddScoped<IAppRoleClaimDA, AppRoleClaimDA>();
            services.AddScoped<IAppRoleDA, AppRoleDA>();
            services.AddScoped<IAppSettingDA, AppSettingDA>();
            services.AddScoped<IAppStoreDA, AppStoreDA>();
            services.AddScoped<IAppUserDA, AppUserDA>();
            services.AddScoped<IAppUserRoleDA, AppUserRoleDA>();
            services.AddScoped<ISelfServiceDA, SelfServiceDA>();

            #endregion Data Access

            #region Services

            services.AddScoped<IAppAreaCreationModeService, AppAreaCreationModeService>();
            services.AddScoped<IAppAreaService, AppAreaService>();
            services.AddScoped<IAppCatalogService, AppCatalogService>();
            services.AddScoped<IAppClaimService, AppClaimService>();
            services.AddScoped<IAdminApplicationService, AdminApplicationService>();
            services.AddScoped<IAppPasswordHistoryService, AppPasswordHistoryService>();
            services.AddScoped<IAppPasswordPolicyService, AppPasswordPolicyService>();
            services.AddScoped<IAppPasswordRecoveryRequestService, AppPasswordRecoveryRequestService>();
            services.AddScoped<IAppRoleService, AppRoleService>();
            services.AddScoped<IAppSettingService, AppSettingService>();
            services.AddScoped<IAppStoreService, AppStoreService>();
            services.AddScoped<IAppUserService, AppUserService>();
            services.AddScoped<IIdentityService, IdentityService>();
            services.AddScoped<IPersonService, PersonService>();

            #endregion Services

            #endregion Hedtech.PowerCampus.Administration

            #region Helpers

            services.AddScoped<IAdvisingHelper, AdvisingHelper>();
            services.AddScoped<IFormSettingHelper, FormSettingHelper>();
            services.AddScoped<IHttpClientHelper, HttpClientHelper>();
            services.AddScoped<INotificationsHelper, NotificationsHelper>();
            services.AddScoped<IPictureHelper, PictureHelper>();
            services.AddScoped<IResourcesHelper, ResourcesHelper>();
            services.AddScoped<ISerializationHelper, SerializationHelper>();
            services.AddScoped<ISettingHelper, SettingHelper>();
            services.AddScoped<IStringHelper, StringHelper>();
            services.AddScoped<IReportHelper, ReportHelper>();

            services.AddSingleton<ISiteConfigurationHelper, SiteConfigurationHelper>();

            #endregion Helpers

            #region General services

            services.AddSingleton(typeof(IAppLogger<>), typeof(LoggerAdapter<>));

            #endregion General services

            #region Authentication and Authorization

            services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.EmailClaimType = ClaimTypes.Email;
                options.ClaimsIdentity.RoleClaimType = ClaimsIdentity.DefaultRoleClaimType;
                options.ClaimsIdentity.UserNameClaimType = ClaimsIdentity.DefaultNameClaimType;
                options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
            });

            _ = services.AddIdentity<AppUser, AppRole>(options =>
            {
                options.User.AllowedUserNameCharacters = null;

                // Deactivate password validations as it is validated by the password policies
                options.Password.RequireUppercase = false;
                options.Password.RequiredUniqueChars = 0;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 0;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
            })
            .AddUserManager<CustomUserManager>()
            .AddRoleManager<CustomRoleManager>()
            .AddClaimsPrincipalFactory<CustomUserClaimsPrincipalFactory>()
            .AddPasswordValidator<CustomPasswordPolicy>()
            .AddUserStore<CustomUserStore>()
            .AddRoleStore<CustomRoleStore>()
            .AddSignInManager<CustomSignInManager>();

            services.AddScoped<CustomUserManager>();
            services.AddScoped<CustomLookupNormalizer>();
            services.AddScoped<CustomRoleManager>();
            services.AddScoped<CustomUserClaimsPrincipalFactory>();
            services.AddScoped<CustomPasswordPolicy>();
            services.AddScoped<CustomUserStore>();
            services.AddScoped<CustomRoleStore>();
            services.AddScoped<CustomSignInManager>();
            services.AddScoped<CustomCookieAuthenticationEvents>();
            services.AddScoped<CustomWsFederationEvents>();

            services.AddSingleton<ITicketStore, CustomCookieSessionStore>();

            AuthenticationBuilder authenticationBuilder = services.AddAuthentication();
            foreach (AdfsStoreSettings adfsStore in adfsStoreSettings)
            {
                string scheme = adfsStore.Name;
                authenticationBuilder = authenticationBuilder.AddWsFederation(scheme, adfsStore.Name, options =>
                {
                    options.CallbackPath = new PathString($"/signin-wsfed-{scheme}");
                    options.CorrelationCookie.Name = Constants._adfsCorrelationCookieName;
                    options.EventsType = typeof(CustomWsFederationEvents);
                    options.MetadataAddress = adfsStore.MetadataAddress;
                    options.UseTokenLifetime = true;
                    options.Wtrealm = adfsStore.WtRealm;
                });
            }

            services.ConfigureApplicationCookie(configureOptions =>
            {
                configureOptions.AccessDeniedPath = new PathString("/Errors/Error403");
                configureOptions.Cookie.HttpOnly = true;
                configureOptions.Cookie.Name = Constants._cookieName;
                configureOptions.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                configureOptions.EventsType = typeof(CustomCookieAuthenticationEvents);
                configureOptions.ExpireTimeSpan = new TimeSpan(0, Constants._defaultCookieTimeout, 0);
                configureOptions.LoginPath = new PathString("/Home/LogIn");
                configureOptions.LogoutPath = new PathString("/Home/LogOut");
                configureOptions.ReturnUrlParameter = CookieAuthenticationDefaults.ReturnUrlParameter;
                configureOptions.SlidingExpiration = true;
            });

            services.ConfigureExternalCookie(configureOptions =>
            {
                configureOptions.Cookie.HttpOnly = true;
                configureOptions.Cookie.Name = Constants._adfsCookieName;
            });

            services.AddAuthorization();

            #endregion Authentication and Authorization

            services.Configure<IISServerOptions>(options => options.AllowSynchronousIO = true);
        }

        #region Private Methods

        /// <summary>
        /// Handles the missing configuration.
        /// </summary>
        /// <param name="app">The application.</param>
        private static void HandleMissingConfiguration(IApplicationBuilder app)
        {
            app.Run(context =>
            {
                context.Response.Redirect($"{context.Request.PathBase}/Errors/Error");
                return Task.CompletedTask;
            });
        }

        #endregion Private Methods
    }
}