// --------------------------------------------------------------------
// <copyright file="DossiersController.cs" company="Ellucian">
//     Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Dossier;
using SelfService.Models.Registration;
using SelfService.Models.Schedule;
using SelfService.Models.Students;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Manages setup and data for Dossiers
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class DossiersController : BaseEndpointController
    {
        /// <summary>
        /// The dossier service
        /// </summary>
        private readonly IDossierService _dossierService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<DossiersController> _logger;

        /// <summary>
        /// The name format service
        /// </summary>
        private readonly INameFormatService _nameFormatService;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The schedule service
        /// </summary>
        private readonly IScheduleService _scheduleService;

        /// <summary>
        /// Initializes a new instance of the <see cref="DossiersController" /> class.
        /// </summary>
        /// <param name="dossierService">The dossier service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="nameFormatService">The name format service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="scheduleService">The schedule service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public DossiersController(
            IDossierService dossierService,
            IInstitutionSettingService institutionSettingService,
            INameFormatService nameFormatService,
            IPeopleService peopleService,
            IScheduleService scheduleService,
            ISerializationHelper serializationHelper,
            IAppLogger<DossiersController> logger)
            : base(serializationHelper)
        {
            _dossierService = dossierService;
            _institutionSettingService = institutionSettingService;
            _nameFormatService = nameFormatService;
            _peopleService = peopleService;
            _scheduleService = scheduleService;

            _logger = logger;
        }

        /// <summary>
        /// Detailses the specified dossier details.
        /// </summary>
        /// <param name="dossierDetails">The dossier details.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Dossiers/Details")]
        public JsonResult Details([FromBody] DossierDetailsModel dossierDetails)
        {
            try
            {
                if (dossierDetails.PersonId > 0)
                {
                    string dossierNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.Staff);
                    string dossierNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.Staff);
                    bool dossierShowMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.Staff);

                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    bool showPicture = false;
                    switch (dossierDetails.DossierType)
                    {
                        case DossierType.Student:
                            showPicture = _institutionSettingService.GetStudentRecords().ShowStudentPicture;
                            break;

                        case DossierType.Faculty:
                        case DossierType.General:
                            break;
                    }
                    (Dossier dossierDTO, List<DossierSetup> dossierSetups)
                        = _dossierService.Get(dossierDetails.DossierType, dossierDetails.PersonId, Account.PersonId);
                    InstitutionSettings.EmergencyContacts settings = _institutionSettingService.GetEmergencyContacts();
                    DossierViewModel dossier = dossierDTO.ToViewModel(dossierSetups, dossierDetails.PersonId,
                        dossierNameFormat, dossierNameSort, showPicture, general, settings, dossierShowMiddleNameInitial);

                    return Json(SerializationHelper.ToJsonResult(new
                    {
                        dossier,
                        dossierSetups
                    }));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DossiersController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the Faculty con ed schedule.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Dossiers/FacultyConEdSchedule")]
        public JsonResult FacultyConEdSchedule([FromBody] int personId)
        {
            try
            {
                if (personId > 0)
                {
                    string dossierNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.General);
                    string dossierNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.General);
                    bool dossierShowMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.General);

                    ClassDetailFilter filter = new()
                    {
                        PersonId = personId,
                    };

                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    List<ClassDetail> classDetails = _scheduleService.GetForFacultyConEd(filter);
                    List<FacultyScheduleViewModel> facultySchedulesViewModel
                        = classDetails.ToViewModel(_institutionSettingService, dossierNameFormat, dossierNameSort, dossierShowMiddleNameInitial, general.DateTimeCulture);

                    return Json(SerializationHelper.ToJsonResult(facultySchedulesViewModel));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DossiersController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the Faculty schedule.
        /// </summary>
        /// <param name="studentScheduleModel">The student schedule model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Dossiers/FacultySchedule")]
        public JsonResult FacultySchedule([FromBody] StudentScheduleModel studentScheduleModel)
        {
            try
            {
                YearTermSessionModel yearTermSession = studentScheduleModel.YearTermSession;
                int personId = studentScheduleModel.PersonId;
                if (personId > 0 && yearTermSession?.Year > 0 && !string.IsNullOrEmpty(yearTermSession.Term))
                {
                    string dossierNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.General);
                    string dossierNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.General);
                    bool dossierShowMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.General);

                    ClassDetailFilter filter = new()
                    {
                        PersonId = personId,
                        Term = yearTermSession.Term,
                        Session = yearTermSession.Session,
                        Year = yearTermSession.Year
                    };

                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    List<ClassDetail> classDetails = _scheduleService.GetForFaculty(filter);
                    List<FacultyScheduleViewModel> facultySchedulesViewModel
                        = classDetails.ToViewModel(_institutionSettingService, dossierNameFormat, dossierNameSort, dossierShowMiddleNameInitial, general.DateTimeCulture);

                    return Json(SerializationHelper.ToJsonResult(facultySchedulesViewModel));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DossiersController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Saves the dossier setup.
        /// </summary>
        /// <param name="dossierSetupModel">The dossier setup model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Dossiers/Setup/Save")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupDossier } })]
        public JsonResult SaveSetup([FromBody] DossierSetupModel dossierSetupModel)
        {
            try
            {
                List<DossierSetup> adds = dossierSetupModel.Adds;
                List<DossierSetup> deletes = dossierSetupModel.Deletes;
                List<DossierSetup> updates = dossierSetupModel.Updates;
                return Json(SerializationHelper.ToJsonResult(_dossierService.UpdateSetup(adds, deletes, updates, Account.PersonId)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DossiersController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the dossier setup.
        /// </summary>
        /// <param name="dossierType">Type of the dossier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Dossiers/Setup/Details/{dossierType}")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupDossier } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult SetupDetails(DossierType dossierType)
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_dossierService.GetSetup(dossierType)));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DossiersController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the student ConEd schedule.
        /// </summary>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Dossiers/StudentConEdSchedule")]
        public JsonResult StudentConEdSchedule([FromBody] int personId)
        {
            try
            {
                if (personId > 0)
                {
                    string dossierNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.General);
                    string dossierNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.General);
                    bool dossierShowMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.General);

                    InstitutionSettings.ConEdRegistration conEdRegistrationSettings = _institutionSettingService.GetConEdRegistration();
                    ClassDetailFilter filter = new()
                    {
                        PersonId = personId,
                        Cart = true,
                        Waitlist = true,
                        Registered = true,
                        PermissionRequest = conEdRegistrationSettings.EnableInstructorPermissionRequest,
                        RegisterForPendingCourses = conEdRegistrationSettings.EnableRegisterForPendingCourses
                    };

                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    List<List<ClassDetail>> classDetailsList = _scheduleService.GetForStudentConEd(filter);
                    List<List<StudentScheduleViewModel>> studentSchedulesListViewModel
                        = classDetailsList.ToViewModel(_institutionSettingService, dossierNameFormat, dossierNameSort, dossierShowMiddleNameInitial, general.DateTimeCulture);

                    List<StudentScheduleViewModel> studentSchedulesViewModel = new();
                    studentSchedulesViewModel.AddRange(studentSchedulesListViewModel[(int)ClassDetailType.Waitlist]);
                    studentSchedulesViewModel.AddRange(studentSchedulesListViewModel[(int)ClassDetailType.Cart]);
                    studentSchedulesViewModel.AddRange(studentSchedulesListViewModel[(int)ClassDetailType.Registered]);

                    return Json(SerializationHelper.ToJsonResult(studentSchedulesViewModel));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DossiersController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the student schedule.
        /// </summary>
        /// <param name="studentScheduleModel">The student schedule model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Dossiers/StudentSchedule")]
        public JsonResult StudentSchedule([FromBody] StudentScheduleModel studentScheduleModel)
        {
            try
            {
                YearTermSessionModel yearTermSession = studentScheduleModel.YearTermSession;
                int personId = studentScheduleModel.PersonId;
                if (personId > 0 && yearTermSession?.Year > 0 && !string.IsNullOrEmpty(yearTermSession.Term))
                {
                    string dossierNameFormat = _nameFormatService.GetByCategory(NameFormatCategoryType.General);
                    string dossierNameSort = _nameFormatService.GetSortByCategory(NameFormatCategoryType.General);
                    bool dossierShowMiddleNameInitial = _nameFormatService.GetShowMiddleNameInitialByCategory(NameFormatCategoryType.General);
                    InstitutionSettings.Registration registrationSettings = _institutionSettingService.GetRegistration();
                    ClassDetailFilter filter = new()
                    {
                        PersonId = personId,
                        Cart = true,
                        Denied = true,
                        Pending = true,
                        Waitlist = true,
                        Registered = true,
                        PermissionRequest = registrationSettings.EnableInstructorPermissionRequest,
                        RegisterForPendingCourses = registrationSettings.EnableRegisterForPendingCourses,
                        Term = yearTermSession.Term,
                        Session = yearTermSession.Session,
                        Year = yearTermSession.Year
                    };

                    InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                    (List<List<ClassDetail>> classDetailsList, _) = _scheduleService.GetForStudent(filter);
                    List<List<StudentScheduleViewModel>> studentSchedulesListViewModel
                        = classDetailsList.ToViewModel(_institutionSettingService, dossierNameFormat, dossierNameSort, dossierShowMiddleNameInitial, general.DateTimeCulture);

                    List<StudentScheduleViewModel> studentSchedulesViewModel = new();
                    studentSchedulesViewModel.AddRange(studentSchedulesListViewModel[(int)ClassDetailType.Waitlist]);
                    studentSchedulesViewModel.AddRange(studentSchedulesListViewModel[(int)ClassDetailType.Cart]);
                    studentSchedulesViewModel.AddRange(studentSchedulesListViewModel[(int)ClassDetailType.Pending]);
                    studentSchedulesViewModel.AddRange(studentSchedulesListViewModel[(int)ClassDetailType.Registered]);
                    studentSchedulesViewModel.AddRange(studentSchedulesListViewModel[(int)ClassDetailType.Denied]);

                    return Json(SerializationHelper.ToJsonResult(studentSchedulesViewModel));
                }
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DossiersController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Get the list of views to add a new custom dossier setup section
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Dossier/Setup/Views")]
        [TypeFilter(typeof(ClaimAuthorizeAttribute), Arguments = new object[] { new string[] { ClaimsConstants.AdministrationGeneralSetupDossier } })]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Views()
        {
            try
            {
                return Json(SerializationHelper.ToJsonResult(_peopleService.GetViews()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DossiersController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }
    }
}