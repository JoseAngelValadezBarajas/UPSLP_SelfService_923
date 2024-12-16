// --------------------------------------------------------------------
// <copyright file="SectionCourseManagementViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Schedule;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionCourseManagementViewModel class
    /// </summary>
    public class SectionCourseManagementViewModel
    {
        /// <summary>
        /// Gets or sets the department identifier.
        /// </summary>
        /// <value>
        /// The department identifier.
        /// </value>
        public int? DepartmentId { get; set; }

        /// <summary>
        /// Gets or sets the faculty identifier.
        /// </summary>
        /// <value>
        /// The faculty identifier.
        /// </value>
        public int? FacultyId { get; set; }

        /// <summary>
        /// Gets or sets the period.
        /// </summary>
        /// <value>
        /// The period.
        /// </value>
        public YearTermSessionModel Period { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int? SectionId { get; set; }

        /// <summary>
        /// Gets or sets the session period identifier.
        /// </summary>
        /// <value>
        /// The session period identifier.
        /// </value>
        public int? SessionPeriodId { get; set; }

        /// <summary>
        /// Gets or sets the year.
        /// </summary>
        /// <value>
        /// The year.
        /// </value>
        public string Year { get; set; }
    }
}