// --------------------------------------------------------------------
// <copyright file="PeriodsController.cs" company="Ellucian">
//     Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

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
using SelfService.Mappers;
using SelfService.Models.Account;
using SelfService.Models.Administration;
using SelfService.Models.Periods;
using SelfService.Models.Schedule;
using SelfService.Models.Section;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Periods route
    /// </summary>
    /// <seealso cref="SelfService.Controllers.Endpoints.BaseEndpointController" />
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class PeriodsController : BaseEndpointController
    {
        /// <summary>
        /// The academic default service
        /// </summary>
        private readonly IAcademicDefaultService _academicDefaultService;

        /// <summary>
        /// The agreement service
        /// </summary>
        private readonly IAgreementService _agreementService;

        /// <summary>
        /// The department head service
        /// </summary>
        private readonly IDepartmentHeadService _departmentHeadService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<PeriodsController> _logger;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The period service
        /// </summary>
        private readonly IPeriodService _periodService;

        /// <summary>
        /// The planning service
        /// </summary>
        private readonly IPlanningService _planningService;

        /// <summary>
        /// The registration service
        /// </summary>
        private readonly IRegistrationService _registrationService;

        /// <summary>
        /// Initializes a new instance of the <see cref="PeriodsController"/> class.
        /// </summary>
        /// <param name="academicDefaultService">The academic default service.</param>
        /// <param name="agreementService">The agreement service.</param>
        /// <param name="departmentHeadService">The department head service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="periodService">The period service.</param>
        /// <param name="planningService">The planning service.</param>
        /// <param name="registrationService">The registration service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public PeriodsController(
            IAcademicDefaultService academicDefaultService,
            IAgreementService agreementService,
            IDepartmentHeadService departmentHeadService,
            IInstitutionSettingService institutionSettingService,
            IPeopleService peopleService,
            IPeriodService periodService,
            IPlanningService planningService,
            IRegistrationService registrationService,
            ISerializationHelper serializationHelper,
            IAppLogger<PeriodsController> logger)
            : base(serializationHelper)
        {
            _academicDefaultService = academicDefaultService;
            _agreementService = agreementService;
            _departmentHeadService = departmentHeadService;
            _institutionSettingService = institutionSettingService;
            _peopleService = peopleService;
            _periodService = periodService;
            _planningService = planningService;
            _registrationService = registrationService;

            _logger = logger;
        }

        /// <summary>
        /// Gets the advisee attendance.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Periods/Academic")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult AdviseeAttendance([FromBody] ImpersonateModel model)
        {
            try
            {
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;

                List<TermPeriod> sessionPeriods = _periodService.GetForAdviseeAttendance(personId);
                List<ListOptionViewModel> periods = sessionPeriods.ToViewModel();
                Period period = _periodService.GetCurrent();
                int currentPeriodId = (int)period.TermPeriodId;
                return Json(SerializationHelper.ToJsonResult(new
                {
                    currentPeriodId,
                    periods
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Alerts periods report.
        /// </summary>
        /// <param name="model">The impersonate model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Periods/AlertsReport")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult AlertsReport([FromBody] ImpersonateModel model)
        {
            try
            {
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;

                List<ListOptionViewModel> termPeriods = _periodService.GetForAlertsReport(personId).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(termPeriods));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Approves the grades.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Periods/ApproveGrades")]
        public JsonResult ApproveGrades()
        {
            try
            {
                List<SessionPeriod> periodsDTO = _departmentHeadService.GetStudentGradePeriods(Account.PersonId);
                List<ListOptionViewModel> periods = periodsDTO.ToViewModel(true);
                ListOptionViewModel defaultPeriod = null;
                if (periodsDTO?.Count > 0 && periods?.Count > 0)
                {
                    int position = -1;
                    Period currentPeriod = _periodService.GetCurrent();
                    if (currentPeriod != null)
                        position = periodsDTO.FindIndex(pr => pr.Year == currentPeriod.Year && pr.TermCode == currentPeriod.TermCode);
                    if (position >= 0)
                        defaultPeriod = periods[position];
                    else
                        defaultPeriod = periods[0];
                }
                return Json(SerializationHelper.ToJsonResult(new { periods, defaultPeriod }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get periods for Authorize Registration
        /// </summary>
        /// <returns>
        /// JsonResult
        /// </returns>
        [HttpGet]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult AuthorizeRegistration()
        {
            try
            {
                List<SessionPeriod> sessionPeriods = _periodService.GetForAuthorizeRegistration();
                return Json(SerializationHelper.ToJsonResult(sessionPeriods.ToViewModel(true)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Get periods for Balance Report
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Periods/BalanceReport/{personId}")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult BalanceReport(int? personId)
        {
            try
            {
                personId ??= Account.PersonId;
                List<ListOptionViewModel> periods = _periodService.GetForBalanceReport(personId.Value).ToViewModel(false, true);
                ListOptionViewModel defaultPeriod = null;
                if (periods?.Count > 0)
                {
                    Period currentPeriod = _periodService.GetCurrent();
                    if (currentPeriod != null)
                    {
                        defaultPeriod = currentPeriod.ToViewModel(false, false);
                        if (periods.Exists(pr => pr.Value == defaultPeriod.Value))
                            defaultPeriod = periods.First(pr => pr.Value == defaultPeriod.Value);
                        else
                            defaultPeriod = periods[0];
                    }
                    else
                        defaultPeriod = periods[0];
                }
                List<ListOptionViewModel> periodsToPayment = _periodService.GetForPayment().ToViewModel(true, false, true);
                InstitutionSettings.Financial financialSettings = _institutionSettingService.GetFinancial();
                bool displayOverallBalance = financialSettings.DisplayOverallBalance;
                bool enableOnlinePayment = financialSettings.EnableOnlinePayment;
                // Construye el JSON manualmente
                var accountJson = new
                {
                    newPersonId = Account.PersonId,
                    newDisplayName = Account.DisplayName,
                    newEmail = Account.Email,
                    newPeopleCodeId= Account.PeopleCodeId,
                    newPeopleId= Account.PeopleId,
                    newUserName= Account.UserName
                };
                return Json(SerializationHelper.ToJsonResult(new
                {
                    periods,
                    periodsToPayment,
                    defaultPeriod,
                    displayOverallBalance,
                    enableOnlinePayment,
                    userAccountDetails = accountJson,
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }


        /// <summary>
        /// Get User for Balance Report
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Periods/BalanceUser/{personId}")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult BalanceUser(int? personId)
        {
            try
            {
                personId ??= Account.PersonId;
                List<ListOptionViewModel> periods = _periodService.GetForBalanceReport(personId.Value).ToViewModel(false, true);
                ListOptionViewModel defaultPeriod = null;
                if (periods?.Count > 0)
                {
                    Period currentPeriod = _periodService.GetCurrent();
                    if (currentPeriod != null)
                    {
                        defaultPeriod = currentPeriod.ToViewModel(false, false);
                        if (periods.Exists(pr => pr.Value == defaultPeriod.Value))
                            defaultPeriod = periods.First(pr => pr.Value == defaultPeriod.Value);
                        else
                            defaultPeriod = periods[0];
                    }
                    else
                        defaultPeriod = periods[0];
                }
                List<ListOptionViewModel> periodsToPayment = _periodService.GetForPayment().ToViewModel(true, false, true);
                InstitutionSettings.Financial financialSettings = _institutionSettingService.GetFinancial();
                bool displayOverallBalance = financialSettings.DisplayOverallBalance;
                bool enableOnlinePayment = financialSettings.EnableOnlinePayment;
                return Json(SerializationHelper.ToJsonResult(new
                {
                    periods,
                    periodsToPayment,
                    defaultPeriod,
                    displayOverallBalance,
                    enableOnlinePayment
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Gets year/terms for block registration.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Periods/BlockRegistration")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] {
            ClaimsConstants.AdministrationStudentSetupBlockRegistrationBlocks,
            ClaimsConstants.AdministrationStudentSetupBlockRegistrationRules
         }, true })]
        public JsonResult BlockRegistration()
        {
            try
            {
                List<ListOptionViewModel> termPeriods = _periodService.GetForBlockRegistration().ToViewModel();
                return Json(SerializationHelper.ToJsonResult(new
                {
                    termPeriods,
                    enableBlockRegistration = _institutionSettingService.GetRegistration().EnableBlockRegistration
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Checklists the terms.
        /// </summary>
        /// <param name="yearTerm">The year term.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Periods/Checklist/Sessions")]
        public JsonResult ChecklistSessions([FromBody] YearTermModel yearTerm)
        {
            try
            {
                List<ListOptionViewModel> sessions = _periodService.GetForChecklist(yearTerm.Year.ToString(), yearTerm.Term).ToViewModel(false, false);
                return Json(SerializationHelper.ToJsonResult(sessions));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Courses the management.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Periods/CourseManagement")]
        public JsonResult CourseManagement([FromBody] SectionCourseManagementViewModel filter)
        {
            try
            {
                List<SessionPeriod> periodsDTO = null;
                bool defaultList = true;
                if (filter.DepartmentId != null && filter.DepartmentId > 0)
                {
                    periodsDTO = _departmentHeadService.GetPeriodsByDepartment(filter.DepartmentId.Value);
                    defaultList = false;
                }
                else if (filter.FacultyId != null && filter.FacultyId > 0)
                {
                    periodsDTO = _departmentHeadService.GetPeriodsByFaculty(Account.PersonId, filter.FacultyId.Value);
                    defaultList = false;
                }
                else if (!string.IsNullOrEmpty(filter.Year))
                {
                    periodsDTO = _departmentHeadService.GetPeriodsByYear(Account.PersonId, filter.Year);
                    defaultList = false;
                }
                if (defaultList)
                    periodsDTO = _departmentHeadService.GetFacultyPeriods(Account.PersonId);
                List<ListOptionViewModel> periods = periodsDTO.ToViewModel(true);

                ListOptionViewModel defaultPeriod = null;
                if (periodsDTO?.Count > 0 && periods?.Count > 0)
                {
                    int position = -1;
                    if (filter.Period != null)
                    {
                        if (!string.IsNullOrEmpty(filter.Period.Session))
                        {
                            position = periodsDTO.FindIndex(pr => pr.Year == filter.Period.Year.ToString()
                            && pr.TermCode == filter.Period.Term
                            && pr.SessionCode == filter.Period.Session);
                        }
                        else
                        {
                            position = periodsDTO.FindIndex(pr => pr.Year == filter.Period.Year.ToString()
                                && pr.TermCode == filter.Period.Term);
                        }
                    }
                    else
                    {
                        Period currentPeriod = _periodService.GetCurrent();
                        if (currentPeriod != null)
                            position = periodsDTO.FindIndex(pr => pr.Year == currentPeriod.Year && pr.TermCode == currentPeriod.TermCode);
                    }
                    if (position >= 0)
                        defaultPeriod = periods[position];
                    else
                        defaultPeriod = periods[0];
                }
                return Json(SerializationHelper.ToJsonResult(new { periods, defaultPeriod }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(SectionsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Endpoint to get the periods for degree requirements.
        /// </summary>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Periods/DegreeRequirements")]
        [AllowAnonymous]
        public JsonResult DegreeRequirements()
        {
            try
            {
                List<Period> periods = _planningService.GetPeriods(Account?.PersonId ?? 0, false);
                List<ListOptionViewModel> options = periods.ToViewModel(false, false);
                return Json(SerializationHelper.ToJsonResult(options));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Endpoint to get the periods for the faculty schedule in the dossier
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Periods/DossierFacultySchedule/{personId}")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult DossierFacultySchedule(int personId)
        {
            try
            {
                List<ListOptionViewModel> periods = _periodService.GetForDossierFacultySchedule(personId).ToViewModel(false, true);
                return Json(SerializationHelper.ToJsonResult(periods));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Endpoint to get the periods for the student schedule in the dossier
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Periods/DossierStudentSchedule/{personId}")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult DossierStudentSchedule(int personId)
        {
            try
            {
                List<ListOptionViewModel> periods = _periodService.GetForDossierStudentSchedule(personId).ToViewModel(false, true);
                return Json(SerializationHelper.ToJsonResult(periods));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the Faculties schedule.
        /// </summary>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [Route("Periods/FacultySchedule")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult FacultySchedule()
        {
            try
            {
                List<ListOptionViewModel> periods = _periodService.GetForFacultySchedule(Account.PersonId).ToViewModel(false, true);
                return Json(SerializationHelper.ToJsonResult(periods));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the FinancialAid periods
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Periods/FinancialAid/{personId}")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult FinancialAid(int? personId)
        {
            try
            {
                personId ??= Account.PersonId;
                List<ListOptionViewModel> periods = _periodService.GetForFinancialAid(personId.Value, personId.Value).ToViewModel();
                return Json(SerializationHelper.ToJsonResult(periods));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Grades the report.
        /// </summary>
        /// <param name="model">The impersonate model.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult GradeReport([FromBody] ImpersonateModel model)
        {
            try
            {
                int id = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                List<ListOptionViewModel> periods = _periodService.GetForGradeReport(id).ToViewModel(true);
                return Json(SerializationHelper.ToJsonResult(periods));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Endpoint to get the periods for registration.
        /// </summary>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Periods/Registration")]
        public JsonResult Registration()
        {
            try
            {
                // Academic information
                bool hasAcademicInfo = _registrationService.CheckAllowToRegister(Account.PersonId);
                if (!hasAcademicInfo)
                {
                    AcademicDefault academicDefault = _academicDefaultService.Get(RegistrationType.Traditional);
                    hasAcademicInfo = academicDefault.AllowDefaultRegistration;
                }

                // Stoplist
                bool isOnStopList = false;
                List<StopList> stopLists = _peopleService.GetStopList(Account.PersonId);
                if (stopLists?.Count > 0)
                    isOnStopList = stopLists.Find(x => x.IsRegistrationStop) != null;

                // Periods
                _periodService.GetForRegistration(
                    Account.PersonId, out List<Period> periodsRegistration,
                    out List<Period> periodsSectionSearch, out Period currentPeriod);

                List<ListOptionViewModel> periodsForRegistration = null;
                if (periodsRegistration != null)
                    periodsForRegistration = periodsRegistration.ToViewModel(false, false);
                List<ListOptionViewModel> periodsForSearch = null;
                if (periodsSectionSearch != null)
                    periodsForSearch = periodsSectionSearch.ToViewModel(false, false);
                ListOptionViewModel defaultPeriod = null;
                if (currentPeriod != null)
                    defaultPeriod = currentPeriod.ToViewModel(false, false);

                InstitutionSettings.Registration registrationSettings = _institutionSettingService.GetRegistration();

                // Block Registration
                bool enableBlockRegistration = registrationSettings.EnableBlockRegistration;

                // Agreement
                AgreementDetail agreement = null;
                // If there are no warnings, then the agreement is displayed
                if (hasAcademicInfo
                    && !isOnStopList)
                {
                    bool enableStudentAgreement = registrationSettings.EnableStudentAgreement;
                    if (enableStudentAgreement)
                    {
                        int agreementId = registrationSettings.AgreementId;
                        agreement = _agreementService.GetById(agreementId);
                        PeriodStatusViewModel periodStatus = null;
                        for (int i = 0; i < periodsRegistration.Count; i++)
                        {
                            periodStatus = periodsForRegistration[i].Complement;
                            periodStatus.PeopleAgreementStatus = _peopleService.HasAgreementAccepted(
                                Account.PersonId,
                                AgreementType.Registration,
                                int.Parse(periodsRegistration[i].Year),
                                periodsRegistration[i].TermCode);
                        }
                    }
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    agreement,
                    defaultPeriod,
                    enableBlockRegistration,
                    hasAcademicInfo,
                    isOnStopList,
                    periodsForRegistration,
                    periodsForSearch
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Schedules the requests.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult ScheduleRequests([FromBody] ImpersonateModel model)
        {
            try
            {
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                List<ApprovalRequestPeriod> sessionPeriods = _periodService.GetForScheduleRequests(personId);
                return Json(SerializationHelper.ToJsonResult(sessionPeriods));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the Students schedule.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Periods/StudentSchedule")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult StudentSchedule([FromBody] ImpersonateModel model)
        {
            try
            {
                int personId = model?.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;

                List<ListOptionViewModel> periods = _periodService.GetForSchedule(personId).ToViewModel(false, true);
                return Json(SerializationHelper.ToJsonResult(periods));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Whats if.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Periods/WhatIf")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult WhatIf([FromBody] ImpersonateInfoModel impersonateInfo)
        {
            try
            {
                List<TermPeriod> periods = _periodService.GetForWhatIf(impersonateInfo?.PersonId ?? Account?.PersonId ?? 0);
                List<ListOptionViewModel> options = periods.ToViewModel(true);
                return Json(SerializationHelper.ToJsonResult(options));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #region AssignmentHeaderTemplate

        /// <summary>
        /// Get the periods for Courses templates.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("Periods/CourseTemplates")]
        public JsonResult CourseTemplates()
        {
            try
            {
                List<ListOptionViewModel> sessionPeriods = _periodService.GetForAssignmentTemplate(Account.PersonId, false).ToViewModel(true);
                return Json(SerializationHelper.ToJsonResult(sessionPeriods));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion AssignmentHeaderTemplate

        #region PeriodFilter

        /// <summary>
        /// Get UIAreas with subareas.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupPeriodFilters } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Areas()
        {
            try
            {
                List<Area> areas = _periodService.GetFilterAreas();
                return Json(SerializationHelper.ToJsonResult(areas.GroupBy(a => a.SubArea).Select(a => new
                {
                    subarea = a.Key,
                    areas = a.Select(b => new
                    {
                        b.Id,
                        b.Name,
                        b.Order
                    }).OrderBy(b => b.Order).ToArray()
                })));
            }
            catch (Exception ex)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, ex.Message, ex);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the period filters.
        /// </summary>
        /// <param name="periodFilterModel">The period filter model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Periods/PeriodFilters")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupPeriodFilters } })]
        public JsonResult PeriodFilters([FromBody] PeriodFilterModel periodFilterModel)
        {
            try
            {
                int id = periodFilterModel.Id;
                string year = periodFilterModel.Year;
                List<ListOptionViewModel> yearsList = null;
                int idMain = 0;
                int idRelated = 0;
                if (id == 3 || id == 5)
                {
                    idMain = 3;
                    idRelated = 5;
                }
                else
                {
                    idMain = id;
                }
                if (string.IsNullOrEmpty(year))
                {
                    year = _periodService.GetCurrentYear();
                    List<string> years = _periodService.GetAcademicYears();
                    if (years?.Count > 0)
                    {
                        yearsList = years.Select(y => new ListOptionViewModel()
                        {
                            Description = y,
                            Value = y
                        }).ToList();
                        if (years.Find(y => y == year) == null)
                            year = years[0];
                    }
                }
                List<SessionPeriodFilterInfo> sessionPeriodFilters = null;
                if (idMain > 0)
                    sessionPeriodFilters = _periodService.GetFilters(idMain, year);
                List<SessionPeriodFilterInfo> sessionPeriodFiltersRelated = null;
                if (idRelated > 0)
                    sessionPeriodFiltersRelated = _periodService.GetFilters(idRelated, year);
                return Json(SerializationHelper.ToJsonResult(new
                {
                    withRelated = idRelated > 0,
                    year,
                    yearsList,
                    periods = sessionPeriodFilters?.ToViewModel(sessionPeriodFiltersRelated)
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the period filter.
        /// </summary>
        /// <param name="sessionPeriodFilter">The session period filter.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Periods/SavePeriodFilter")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupPeriodFilters } })]
        public JsonResult SavePeriodFilter([FromBody] SessionPeriodFilterModel sessionPeriodFilter)
        {
            try
            {
                bool result = false;

                if (sessionPeriodFilter.Id > 0 && sessionPeriodFilter.PeriodFilterId > 0)
                {
                    int idMain = 0;
                    int idRelated = 0;
                    if (sessionPeriodFilter.Id == 3 || sessionPeriodFilter.Id == 5)
                    {
                        idMain = 3;
                        idRelated = 5;
                    }
                    else
                    {
                        idMain = sessionPeriodFilter.Id;
                    }

                    if (idRelated > 0)
                    {
                        List<int> periodFiltersAdds = new();
                        List<int> periodFiltersDrops = new();
                        List<int> periodFiltersRelatedAdds = new();
                        List<int> periodFiltersRelatedDrops = new();
                        if (sessionPeriodFilter.IsEnabled && sessionPeriodFilter.IsEnabledRelated)
                        {
                            if (sessionPeriodFilter.RelatedModified)
                                periodFiltersRelatedAdds.Add(sessionPeriodFilter.PeriodFilterId);
                            else
                                periodFiltersAdds.Add(sessionPeriodFilter.PeriodFilterId);
                        }
                        else if (!sessionPeriodFilter.IsEnabled && !sessionPeriodFilter.IsEnabledRelated)
                        {
                            if (sessionPeriodFilter.RelatedModified)
                                periodFiltersRelatedDrops.Add(sessionPeriodFilter.PeriodFilterId);
                            else
                                periodFiltersDrops.Add(sessionPeriodFilter.PeriodFilterId);
                        }
                        else if (sessionPeriodFilter.IsEnabled && !sessionPeriodFilter.IsEnabledRelated)
                        {
                            if (sessionPeriodFilter.RelatedModified)
                                periodFiltersRelatedDrops.Add(sessionPeriodFilter.PeriodFilterId);
                            else
                                periodFiltersAdds.Add(sessionPeriodFilter.PeriodFilterId);
                        }
                        else
                        {
                            if (sessionPeriodFilter.RelatedModified)
                            {
                                sessionPeriodFilter.IsEnabled = true;
                                sessionPeriodFilter.IsEnabledRelated = true;
                                periodFiltersAdds.Add(sessionPeriodFilter.PeriodFilterId);
                                periodFiltersRelatedAdds.Add(sessionPeriodFilter.PeriodFilterId);
                            }
                            else
                            {
                                sessionPeriodFilter.IsEnabled = false;
                                sessionPeriodFilter.IsEnabledRelated = false;
                                periodFiltersDrops.Add(sessionPeriodFilter.PeriodFilterId);
                                periodFiltersRelatedDrops.Add(sessionPeriodFilter.PeriodFilterId);
                            }
                        }
                        if (periodFiltersAdds.Count > 0)
                            result = _periodService.CreateFilters(idMain, periodFiltersAdds);
                        if (periodFiltersDrops.Count > 0)
                            result = _periodService.DeleteFilters(idMain, periodFiltersDrops);
                        if (periodFiltersRelatedAdds.Count > 0)
                            result = _periodService.CreateFilters(idRelated, periodFiltersRelatedAdds);
                        if (periodFiltersRelatedDrops.Count > 0)
                            result = _periodService.DeleteFilters(idRelated, periodFiltersRelatedDrops);
                    }
                    else
                    {
                        List<int> periodFilters = new(9)
                        {
                            sessionPeriodFilter.PeriodFilterId
                        };
                        if (sessionPeriodFilter.IsEnabled)
                            result = _periodService.CreateFilters(idMain, periodFilters);
                        else
                            result = _periodService.DeleteFilters(idMain, periodFilters);
                    }
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    result,
                    sessionPeriodFilter
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(PeriodsController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        #endregion PeriodFilter
    }
}