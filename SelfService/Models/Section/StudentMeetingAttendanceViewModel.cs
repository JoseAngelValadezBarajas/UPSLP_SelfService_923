// --------------------------------------------------------------------
// <copyright file="StudentMeetingAttendanceViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionMeetingCalendarViewModel
    /// </summary>
    public class SectionMeetingCalendarViewModel
    {
        /// <summary>
        /// Gets or sets the name of the building.
        /// </summary>
        /// <value>
        /// The name of the building.
        /// </value>
        public string BuildingName { get; set; }

        /// <summary>
        /// Gets or sets the calendar key.
        /// </summary>
        /// <value>
        /// The calendar key.
        /// </value>
        public int CalendarKey { get; set; }

        /// <summary>
        /// Gets or sets the name of the campus.
        /// </summary>
        /// <value>
        /// The name of the campus.
        /// </value>
        public string CampusName { get; set; }

        /// <summary>
        /// Gets or sets the end time.
        /// </summary>
        /// <value>
        /// The end time.
        /// </value>
        public string EndTime { get; set; }

        /// <summary>
        /// Gets or sets the floor identifier.
        /// </summary>
        /// <value>
        /// The floor identifier.
        /// </value>
        public string FloorId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [missing attendance].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [missing attendance]; otherwise, <c>false</c>.
        /// </value>
        public bool MissingAttendance { get; set; }

        /// <summary>
        /// Gets or sets the notes.
        /// </summary>
        /// <value>
        /// The notes.
        /// </value>
        public string Notes { get; set; }

        /// <summary>
        /// Gets or sets the room identifier.
        /// </summary>
        /// <value>
        /// The room identifier.
        /// </value>
        public string RoomId { get; set; }

        /// <summary>
        /// Gets or sets the name of the room.
        /// </summary>
        /// <value>
        /// The name of the room.
        /// </value>
        public string RoomName { get; set; }

        /// <summary>
        /// Gets or sets the start time.
        /// </summary>
        /// <value>
        /// The start time.
        /// </value>
        public string StartTime { get; set; }
    }

    /// <summary>
    /// StudentMeetingAttendanceCalendarViewModel
    /// </summary>
    public class StudentMeetingAttendanceCalendarViewModel
    {
        /// <summary>
        /// Gets or sets the attendance status desc.
        /// </summary>
        /// <value>
        /// The attendance status desc.
        /// </value>
        public string AttendanceStatusDesc { get; set; }

        /// <summary>
        /// Gets or sets the calendar date.
        /// </summary>
        /// <value>
        /// The calendar date.
        /// </value>
        public string CalendarDate { get; set; }

        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public string Comments { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="StudentMeetingAttendance"/> is withdrawn.
        /// </summary>
        /// <value>
        ///   <c>true</c> if withdrawn; otherwise, <c>false</c>.
        /// </value>
        public bool Withdrawn { get; set; }
    }

    /// <summary>
    /// StudentMeetingAttendanceDownloadViewModel
    /// </summary>
    public class StudentMeetingAttendanceDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>
        /// The full name.
        /// </value>
        public string FullName { get; set; }

        /// <summary>
        /// Gets or sets the meeting attendances.
        /// </summary>
        /// <value>
        /// The meeting attendances.
        /// </value>
        public List<StudentMeetingAttendanceCalendarViewModel> MeetingAttendances { get; set; }

        /// <summary>
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }
    }

    public class StudentMeetingAttendanceViewModel : AvatarViewModel
    {
        /// <summary>
        /// Gets or sets the attendance status.
        /// </summary>
        /// <value>
        /// The attendance status.
        /// </value>
        public int AttendanceStatus { get; set; }

        /// <summary>
        /// Gets or sets the attendance status desc.
        /// </summary>
        /// <value>
        /// The attendance status desc.
        /// </value>
        public string AttendanceStatusDesc { get; set; }

        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public string Comments { get; set; }

        /// <summary>
        /// Gets or sets the student meeting attendance identifier.
        /// </summary>
        /// <value>
        /// The student meeting attendance identifier.
        /// </value>
        public int? StudentMeetingAttendanceId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="StudentMeetingAttendance"/> is withdrawn.
        /// </summary>
        /// <value>
        ///   <c>true</c> if withdrawn; otherwise, <c>false</c>.
        /// </value>
        public bool Withdrawn { get; set; }
    }
}