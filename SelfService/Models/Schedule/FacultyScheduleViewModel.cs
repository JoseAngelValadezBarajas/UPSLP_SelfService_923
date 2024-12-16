// --------------------------------------------------------------------
// <copyright file="FacultyScheduleViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Section;
using System.Collections.Generic;

namespace SelfService.Models.Schedule
{
    /// <summary>
    /// FacultyScheduleBySessionViewModel
    /// </summary>
    public class FacultyScheduleBySessionViewModel
    {
        /// <summary>
        /// Gets or sets the sections.
        /// </summary>
        /// <value>
        /// The sections.
        /// </value>
        public List<FacultyScheduleViewModel> Sections { get; set; }

        /// <summary>
        /// Gets or sets the session code.
        /// </summary>
        /// <value>
        /// The session code.
        /// </value>
        public string Session { get; set; }

        /// <summary>
        /// Gets or sets the session desc.
        /// </summary>
        /// <value>
        /// The session desc.
        /// </value>
        public string SessionDesc { get; set; }
    }

    /// <summary>
    /// FacultyScheduleViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Section.SectionViewModel" />
    public class FacultyScheduleViewModel : SectionViewModel
    {
        /// <summary>
        /// Gets or sets the type of the credit.
        /// </summary>
        /// <value>
        /// The type of the credit.
        /// </value>
        public string CreditType { get; set; }

        /// <summary>
        /// Gets or sets the credit type description.
        /// </summary>
        /// <value>
        /// The credit type description.
        /// </value>
        public string CreditTypeDescription { get; set; }

        /// <summary>
        /// Gets or sets the instructor.
        /// </summary>
        /// <value>
        /// The instructor.
        /// </value>
        public int InstructorsCount { get; set; }

        /// <summary>
        /// Gets the schedules count.
        /// </summary>
        /// <value>
        /// The schedules count.
        /// </value>
        public int SchedulesCount { get; set; }
    }
}