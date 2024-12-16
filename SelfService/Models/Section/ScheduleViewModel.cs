// --------------------------------------------------------------------
// <copyright file="ScheduleViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// ScheduleTimeViewModel class
    /// </summary>
    public class ScheduleTimeViewModel
    {
        /// <summary>
        /// Gets or sets the end time.
        /// </summary>
        /// <value>
        /// The end time.
        /// </value>
        public List<int> ScheduledEndTime { get; set; }

        /// <summary>
        /// Gets or sets the start time.
        /// </summary>
        /// <value>
        /// The start time.
        /// </value>
        public List<int> ScheduledStartTime { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }
    }

    /// <summary>
    /// ScheduleViewModel
    /// </summary>
    public class ScheduleViewModel : ScheduleTimeViewModel
    {
        /// <summary>
        /// Gets or sets the name of the BLDG.
        /// </summary>
        /// <value>
        /// The name of the Building Name.
        /// </value>
        public string BldgName { get; set; }

        /// <summary>
        /// Gets or sets the day description.
        /// </summary>
        /// <value>
        /// The day code.
        /// </value>
        public string DayDesc { get; set; }

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
        /// Gets or sets a value indicating whether this instance has time conflict.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has time conflict; otherwise, <c>false</c>.
        /// </value>
        public bool HasTimeConflict { get; set; }

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
        /// Gets or sets the scheduled days.
        /// </summary>
        /// <value>
        /// The scheduled days.
        /// </value>
        public List<int> ScheduledDays { get; set; }

        /// <summary>
        /// Gets or sets the start time.
        /// </summary>
        /// <value>
        /// The start time.
        /// </value>
        public string StartTime { get; set; }
    }
}