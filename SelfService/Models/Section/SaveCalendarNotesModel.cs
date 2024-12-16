// --------------------------------------------------------------------
// <copyright file="SaveCalendarNotesModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Section
{
    /// <summary>
    /// SaveCalendarNotesModel
    /// </summary>
    public class SaveCalendarNotesModel
    {
        /// <summary>
        /// Gets or sets the calendar key.
        /// </summary>
        /// <value>
        /// The calendar key.
        /// </value>
        public int CalendarKey { get; set; }

        /// <summary>
        /// Gets or sets the notes.
        /// </summary>
        /// <value>
        /// The notes.
        /// </value>
        public string Notes { get; set; }
    }
}