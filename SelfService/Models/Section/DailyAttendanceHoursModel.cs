// --------------------------------------------------------------------
// <copyright file="DailyAttendanceHoursModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Section
{
    /// <summary>
    /// DailyAttendanceHoursModel
    /// </summary>
    public class DailyAttendanceHoursModel
    {
        /// <summary>
        /// Gets or sets the calendar date.
        /// </summary>
        /// <value>
        /// The calendar date.
        /// </value>
        public string CalendarDate { get; set; }

        /// <summary>
        /// Gets or sets the calendar key.
        /// </summary>
        /// <value>
        /// The calendar key.
        /// </value>
        public int? CalendarKey { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [include student list].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [include student list]; otherwise, <c>false</c>.
        /// </value>
        public bool IncludeStudentList { get; set; }
    }
}