// --------------------------------------------------------------------
// <copyright file="SectionAttendanceViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Forms;
using SelfService.Models.ResourcesTypes.Downloads;
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// DateAttendanceViewModel
    /// </summary>
    public class DateAttendanceViewModel
    {
        /// <summary>
        /// Gets or sets the calendar date.
        /// </summary>
        /// <value>
        /// The calendar date.
        /// </value>
        public string CalendarDate { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [missing attendance].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [missing attendance]; otherwise, <c>false</c>.
        /// </value>
        public bool MissingAttendance { get; set; }
    }

    /// <summary>
    /// SectionAttendanceStudentViewModel
    /// </summary>
    public class SectionAttendanceStudentViewModel : AvatarViewModel
    {
        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public string Comments { get; set; }

        /// <summary>
        /// Gets or sets the Email.
        /// </summary>
        /// <value>
        /// The Email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the excused absence.
        /// </summary>
        /// <value>
        /// The excused absence.
        /// </value>
        public int ExcusedAbsence { get; set; }

        /// <summary>
        /// Gets or sets the excused tardiness.
        /// </summary>
        /// <value>
        /// The excused tardiness.
        /// </value>
        public int ExcusedTardiness { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the last attended date.
        /// </summary>
        /// <value>
        /// The last attended date.
        /// </value>
        public string LastAttendedDate { get; set; }

        /// <summary>
        /// Gets or sets the overall attendance.
        /// </summary>
        /// <value>
        /// The overall attendance.
        /// </value>
        public string OverallAttendance { get; set; }

        /// <summary>
        /// Gets or sets the section attendance identifier.
        /// </summary>
        /// <value>
        /// The section attendance identifier.
        /// </value>
        public int? SectionAttendanceId { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public string Status { get; set; }

        /// <summary>
        /// Gets or sets the unexcused absence.
        /// </summary>
        /// <value>
        /// The unexcused absence.
        /// </value>
        public int UnexcusedAbsence { get; set; }

        /// <summary>
        /// Gets or sets the unexcused tardiness.
        /// </summary>
        /// <value>
        /// The unexcused tardiness.
        /// </value>
        public int UnexcusedTardiness { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is withdrawn.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is withdrawn; otherwise, <c>false</c>.
        /// </value>
        public bool Withdrawn { get; set; }
    }

    /// <summary>
    /// SectionAttendanceViewModel
    /// </summary>
    public class SectionAttendanceViewModel
    {
        /// <summary>
        /// Gets or sets the attend status codes.
        /// </summary>
        /// <value>
        /// The attend status codes.
        /// </value>
        public List<OptionsViewModel> AttendStatusCodes { get; set; }

        /// <summary>
        /// Gets or sets the email settings.
        /// </summary>
        /// <value>
        /// The email settings.
        /// </value>
        public EmailSettingsViewModel EmailSettings { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show daily attendance].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show daily attendance]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowDailyAttendance { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show overall attendance].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show overall attendance]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowOverallAttendance { get; set; }

        /// <summary>
        /// Gets or sets the student list.
        /// </summary>
        /// <value>
        /// The student list.
        /// </value>
        public List<SectionAttendanceStudentViewModel> StudentList { get; set; }
    }

    /// <summary>
    /// SectionCalendarDateViewModel
    /// </summary>
    public class SectionCalendarDateViewModel
    {
        /// <summary>
        /// Gets or sets the calendar dates.
        /// </summary>
        /// <value>
        /// The calendar dates.
        /// </value>
        public List<DateAttendanceViewModel> CalendarDates { get; set; }

        /// <summary>
        /// Gets or sets the calenda date selected.
        /// </summary>
        /// <value>
        /// The calenda date selected.
        /// </value>
        public string CalendarDateSelected { get; set; }
    }

    #region Attendance Download

    /// <summary>
    /// SectionAttendanceDailyDownloadViewModel
    /// </summary>
    public class SectionAttendanceDailyDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the resources.
        /// </summary>
        /// <value>
        /// The resources.
        /// </value>
        public SectionAttendanceDailyResources Resources { get; set; }

        /// <summary>
        /// Gets or sets the students.
        /// </summary>
        /// <value>
        /// The students.
        /// </value>
        public List<StudentMeetingAttendanceDownloadViewModel> Students { get; set; }
    }

    /// <summary>
    /// SectionAttdendanceDownloadViewModel
    /// </summary>
    public class SectionAttendanceDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the resources.
        /// </summary>
        /// <value>
        /// The resources.
        /// </value>
        public SectionAttendanceResources Resources { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show daily attendance].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show daily attendance]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowDailyAttendance { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show overall attendance].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show overall attendance]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowOverallAttendance { get; set; }

        /// <summary>
        /// Gets or sets the students.
        /// </summary>
        /// <value>
        /// The students.
        /// </value>
        public List<SectionAttendanceStudentDownloadViewModel> Students { get; set; }
    }

    /// <summary>
    /// SectionAttendanceDownloadModel
    /// </summary>
    public class SectionAttendanceStudentDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public string Comments { get; set; }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the excused absence.
        /// </summary>
        /// <value>
        /// The excused absence.
        /// </value>
        public int? ExcusedAbsence { get; set; }

        /// <summary>
        /// Gets or sets the excused tardiness.
        /// </summary>
        /// <value>
        /// The excused tardiness.
        /// </value>
        public int? ExcusedTardiness { get; set; }

        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>
        /// The full name.
        /// </value>
        public string FullName { get; set; }

        /// <summary>
        /// Gets or sets the last date attended.
        /// </summary>
        /// <value>
        /// The last date attended.
        /// </value>
        public string LastDateAttended { get; set; }

        /// <summary>
        /// Gets or sets the overall attendance.
        /// </summary>
        /// <value>
        /// The overall attendance.
        /// </value>
        public string OverallAttendance { get; set; }

        /// <summary>
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public string Status { get; set; }

        /// <summary>
        /// Gets or sets the unexcused absence.
        /// </summary>
        /// <value>
        /// The unexcused absence.
        /// </value>
        public int? UnexcusedAbsence { get; set; }

        /// <summary>
        /// Gets or sets the unexcused tardiness.
        /// </summary>
        /// <value>
        /// The unexcused tardiness.
        /// </value>
        public int? UnexcusedTardiness { get; set; }

        /// <summary>
        /// Gets or sets the withdrawn.
        /// </summary>
        /// <value>
        /// The withdrawn.
        /// </value>
        public bool Withdrawn { get; set; }
    }

    #endregion Attendance Download
}