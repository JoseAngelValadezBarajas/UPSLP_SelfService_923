// --------------------------------------------------------------------
// <copyright file="AdviseeAttendanceViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AdviseeAttendanceDetailViewModel
    /// </summary>
    public class AdviseeAttendanceDetailViewModel
    {
        /// <summary>
        /// Gets or sets the category.
        /// </summary>
        /// <value>
        /// The category.
        /// </value>
        public int Category { get; set; }

        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public string Comments { get; set; }

        /// <summary>
        /// Gets or sets the date.
        /// </summary>
        /// <value>
        /// The date.
        /// </value>
        public string Date { get; set; }

        /// <summary>
        /// Gets or sets the end time.
        /// </summary>
        /// <value>
        /// The end time.
        /// </value>
        public string EndTime { get; set; }

        /// <summary>
        /// Gets or sets the start time.
        /// </summary>
        /// <value>
        /// The start time.
        /// </value>
        public string StartTime { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public string Status { get; set; }
    }

    /// <summary>
    /// AdviseeAttendanceViewModel
    /// </summary>
    public class AdviseeAttendanceViewModel
    {
        /// <summary>
        /// Gets or sets the attendance courses.
        /// </summary>
        /// <value>
        /// The attendance courses.
        /// </value>
        public List<AttendanceCourseViewModel> AttendanceCourses { get; set; }

        /// <summary>
        /// Gets or sets the session desc.
        /// </summary>
        /// <value>
        /// The session desc.
        /// </value>
        public string SessionDesc { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show daily attendance].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show daily attendance]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowDailyAttendance { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show low attendance warning].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show low attendance warning]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowLowAttendanceWarning { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show overall attendance].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show overall attendance]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowOverallAttendance { get; set; }
    }

    /// <summary>
    /// AttendanceCourseViewModel
    /// </summary>
    public class AttendanceCourseViewModel
    {
        /// <summary>
        /// Gets or sets the excused absences.
        /// </summary>
        /// <value>
        /// The excused absences.
        /// </value>
        public string ExcusedAbsences { get; set; }

        /// <summary>
        /// Gets or sets the excused tardiness.
        /// </summary>
        /// <value>
        /// The excused tardiness.
        /// </value>
        public string ExcusedTardiness { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has low attendance.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has low attendance; otherwise, <c>false</c>.
        /// </value>
        public bool HasLowAttendance { get; set; }

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
        /// Gets or sets the present.
        /// </summary>
        /// <value>
        /// The present.
        /// </value>
        public string Present { get; set; }

        /// <summary>
        /// Gets or sets the section.
        /// </summary>
        /// <value>
        /// The section.
        /// </value>
        public string Section { get; set; }

        /// <summary>
        /// Gets or sets the type of the section credit.
        /// </summary>
        /// <value>
        /// The type of the section credit.
        /// </value>
        public string SectionCreditType { get; set; }

        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public string SectionEventId { get; set; }

        /// <summary>
        /// Gets or sets the type of the section event sub.
        /// </summary>
        /// <value>
        /// The type of the section event sub.
        /// </value>
        public string SectionEventSubType { get; set; }

        /// <summary>
        /// Gets or sets the section id.
        /// </summary>
        /// <value>
        /// The section id.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the long name of the section.
        /// </summary>
        /// <value>
        /// The long name of the section.
        /// </value>
        public string SectionLongName { get; set; }

        /// <summary>
        /// Gets or sets the type of the section.
        /// </summary>
        /// <value>
        /// The type of the section.
        /// </value>
        public string SectionType { get; set; }

        /// <summary>
        /// Gets or sets the transcript detail identifier.
        /// </summary>
        /// <value>
        /// The transcript detail identifier.
        /// </value>
        public int TranscriptDetailId { get; set; }

        /// <summary>
        /// Gets or sets the unexcused absences.
        /// </summary>
        /// <value>
        /// The unexcused absences.
        /// </value>
        public string UnexcusedAbsences { get; set; }

        /// <summary>
        /// Gets or sets the unexcused tardiness.
        /// </summary>
        /// <value>
        /// The unexcused tardiness.
        /// </value>
        public string UnexcusedTardiness { get; set; }
    }
}