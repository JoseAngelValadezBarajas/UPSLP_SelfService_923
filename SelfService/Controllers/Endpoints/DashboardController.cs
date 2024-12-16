// --------------------------------------------------------------------
// <copyright file="DashboardController.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Checklist;
using SelfService.Models.Dashboard;
using System;
using System.Collections.Generic;
using System.Globalization;
using CalendarDto = Hedtech.PowerCampus.Core.DTO.Student.Calendar;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Dashboard route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class DashboardController : BaseEndpointController
    {
        /// <summary>
        /// The checklist service
        /// </summary>
        private readonly IChecklistService _checklistService;

        /// <summary>
        /// The dashboard message service
        /// </summary>
        private readonly IDashboardMessageService _dashboardMessageService;

        /// <summary>
        /// The institution setting service
        /// </summary>
        private readonly IInstitutionSettingService _institutionSettingService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<DashboardController> _logger;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// Initializes a new instance of the <see cref="DashboardController"/> class.
        /// </summary>
        /// <param name="checklistService">The checklist service.</param>
        /// <param name="dashboardMessageService">The dashboard message service.</param>
        /// <param name="institutionSettingService">The institution setting service.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="logger">The logger.</param>
        public DashboardController(
            IChecklistService checklistService,
            IDashboardMessageService dashboardMessageService,
            IInstitutionSettingService institutionSettingService,
            IPeopleService peopleService,
            ISerializationHelper serializationHelper,
            IAppLogger<DashboardController> logger)
            : base(serializationHelper)
        {
            _checklistService = checklistService;
            _dashboardMessageService = dashboardMessageService;
            _institutionSettingService = institutionSettingService;
            _peopleService = peopleService;

            _logger = logger;
        }

        /// <summary>
        /// Gets the list of checklist
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Dashboard/Checklist")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
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
        /// Gets the list of events in the calendar for a specific date
        /// </summary>
        /// <param name="date">The date.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Dashboard/Events")]
        public JsonResult Events([FromBody] string date)
        {
            try
            {
                List<DashboardEventViewModel> events = new();
                string dateDesc = string.Empty;
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                DateTime? dateEvents = FormatHelper.FromDatePicker(date);
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                dateDesc = FormatHelper.ToLongDate(dateEvents.Value, datetimeCulture);
                if (dateEvents != null && Account.PersonId > 0)
                {
                    List<CalendarDto> calendarList = _peopleService.GetCalendarByDay((DateTime)dateEvents, Account.PersonId);
                    DashboardEventViewModel dashboardEvent = null;
                    foreach (CalendarDto calendar in calendarList)
                    {
                        dashboardEvent = new DashboardEventViewModel
                        {
                            AcademicSession = calendar.AcademicSession,
                            AcademicTerm = calendar.AcademicTerm,
                            AcademicYear = calendar.AcademicYear,
                            BuildingName = calendar.BuildingName,
                            EndHour = FormatHelper.ToShortTime(calendar.EndTime, datetimeCulture),
                            EndHourValue = FormatHelper.ToTimePicker(calendar.EndTime),
                            EventId = calendar.EventId,
                            EventName = calendar.EventName,
                            EventSubType = calendar.EventSubType,
                            EventSubTypeDesc = calendar.EventSubTypeDesc,
                            FloorId = calendar.FloorId,
                            IsStudent = calendar.IsStudent,
                            Notes = calendar.Notes,
                            OrgName = calendar.OrgName,
                            RoomId = calendar.RoomId,
                            RoomName = calendar.RoomName,
                            SectionId = calendar.SectionId,
                            StartHour = FormatHelper.ToShortTime(calendar.StartTime, datetimeCulture),
                            StartHourValue = FormatHelper.ToTimePicker(calendar.StartTime)
                        };
                        events.Add(dashboardEvent);
                    }
                }
                return Json(SerializationHelper.ToJsonResult(new
                {
                    dateDesc,
                    events
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets a list of my tasks
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Dashboard/MyTasks")]
        [TypeFilter(typeof(NameFormatSessionAttribute))]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult MyTasks()
        {
            try
            {
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                List<ChecklistMyTasksViewModel> MyTasks = _checklistService.GetMyTask(Account.PersonId, false)
                                                         .ToViewModel(CurrentNameFormat, CurrentNameSort, general, ShowMiddleNameInitial);
                return Json(SerializationHelper.ToJsonResult(MyTasks));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets a list of the dashboard notifications
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Dashboard/Notifications")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Notifications()
        {
            try
            {
                List<DashboardNotificationViewModel> notifications = null;
                string generalMessage = string.Empty;
                InstitutionSettings.DashboardMessage dashboardMessage = _institutionSettingService.GetDashboardMessage();
                if (dashboardMessage != null)
                    generalMessage = dashboardMessage.Comments;

                if (Account.PersonId > 0)
                {
                    List<DashboardMessageDetail> notificationsDTO = _dashboardMessageService.GetByPeople(Account.PersonId);
                    if (notificationsDTO?.Count > 0)
                        notifications = notificationsDTO.ToNotificationViewModel();
                }

                return Json(SerializationHelper.ToJsonResult(new
                {
                    generalMessage,
                    notifications
                }));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }

        /// <summary>
        /// Gets the academic status
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Dashboard/Status")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Status()
        {
            try
            {
                // TODO: Get status with percentages(this is not for the GA)
                InstitutionSettings.General general = _institutionSettingService.GetGeneral();
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                DashboardStatusViewModel status = new()
                {
                    AcademicPercentage = "50%",
                    CorePercentage = "75%",
                    ElectivePercentage = "75%",
                    GraduationDate = FormatHelper.ToLongDate(DateTime.Now.AddDays(30), datetimeCulture)
                };

                return Json(SerializationHelper.ToJsonResult(status));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(DashboardController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
        }
    }
}