// --------------------------------------------------------------------
// <copyright file="DashboardViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;

namespace SelfService.Models.Dashboard
{
    /// <summary>
    /// DashboardEventViewModel
    /// </summary>
    public class DashboardEventViewModel
    {
        /// <summary>
        /// Gets or sets the academic session.
        /// </summary>
        /// <value>
        /// The academic session.
        /// </value>
        public string AcademicSession { get; set; }

        /// <summary>
        /// Gets or sets the academic term.
        /// </summary>
        /// <value>
        /// The academic term.
        /// </value>
        public string AcademicTerm { get; set; }

        /// <summary>
        /// Gets or sets the academic year.
        /// </summary>
        /// <value>
        /// The academic year.
        /// </value>
        public string AcademicYear { get; set; }

        /// <summary>
        /// Gets or sets the name of the building.
        /// </summary>
        /// <value>
        /// The name of the building.
        /// </value>
        public string BuildingName { get; set; }

        /// <summary>
        /// Gets or sets the color.
        /// </summary>
        /// <value>
        /// The color.
        /// </value>
        public int Color { get; set; }

        /// <summary>
        /// Gets or sets the end hour.
        /// </summary>
        /// <value>
        /// The end hour.
        /// </value>
        public string EndHour { get; set; }

        /// <summary>
        /// Gets or sets the end hour value.
        /// </summary>
        /// <value>
        /// The end hour value.
        /// </value>
        public string EndHourValue { get; set; }

        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public string EventId { get; set; }

        /// <summary>
        /// Gets or sets the name of the event.
        /// </summary>
        /// <value>
        /// The name of the event.
        /// </value>
        public string EventName { get; set; }

        /// <summary>
        /// Gets the type of the event sub.
        /// </summary>
        /// <value>
        /// The type of the event sub.
        /// </value>
        public string EventSubType { get; internal set; }

        /// <summary>
        /// Gets the event sub type desc.
        /// </summary>
        /// <value>
        /// The event sub type desc.
        /// </value>
        public object EventSubTypeDesc { get; internal set; }

        /// <summary>
        /// Gets or sets the floor identifier.
        /// </summary>
        /// <value>
        /// The floor identifier.
        /// </value>
        public string FloorId { get; set; }

        /// <summary>
        /// Gets a value indicating whether this instance is student.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is student; otherwise, <c>false</c>.
        /// </value>
        public bool IsStudent { get; internal set; }

        /// <summary>
        /// Gets or sets the notes.
        /// </summary>
        /// <value>
        /// The notes.
        /// </value>
        public string Notes { get; set; }

        /// <summary>
        /// Gets or sets the name of the org.
        /// </summary>
        /// <value>
        /// The name of the org.
        /// </value>
        public string OrgName { get; set; }

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
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the start hour.
        /// </summary>
        /// <value>
        /// The start hour.
        /// </value>
        public string StartHour { get; set; }

        /// <summary>
        /// Gets or sets the start hour value.
        /// </summary>
        /// <value>
        /// The start hour value.
        /// </value>
        public string StartHourValue { get; set; }
    }

    /// <summary>
    /// DashboardNotificationViewModel
    /// </summary>
    public class DashboardNotificationViewModel
    {
        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        public DashboardMessageType Type { get; set; }

        /// <summary>
        /// Gets or sets the URL.
        /// </summary>
        /// <value>
        /// The URL.
        /// </value>
        public string Url { get; set; }

        /// <summary>
        /// Gets or sets the URL text.
        /// </summary>
        /// <value>
        /// The URL text.
        /// </value>
        public string UrlText { get; set; }
    }

    /// <summary>
    /// DashboardStatusViewModel
    /// </summary>
    public class DashboardStatusViewModel
    {
        /// <summary>
        /// Gets or sets the academic percentage.
        /// </summary>
        /// <value>
        /// The academic percentage.
        /// </value>
        public string AcademicPercentage { get; set; }

        /// <summary>
        /// Gets or sets the core percentage.
        /// </summary>
        /// <value>
        /// The core percentage.
        /// </value>
        public string CorePercentage { get; set; }

        /// <summary>
        /// Gets or sets the elective percentage.
        /// </summary>
        /// <value>
        /// The elective percentage.
        /// </value>
        public string ElectivePercentage { get; set; }

        /// <summary>
        /// Gets or sets the graduation date.
        /// </summary>
        /// <value>
        /// The graduation date.
        /// </value>
        public string GraduationDate { get; set; }
    }
}