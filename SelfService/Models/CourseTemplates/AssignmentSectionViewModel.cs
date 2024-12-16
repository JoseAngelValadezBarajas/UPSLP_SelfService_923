// --------------------------------------------------------------------
// <copyright file="AssignmentSectionViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentSectionViewModel
    /// </summary>
    public class AssignmentSectionViewModel
    {
        /// <summary>
        /// Gets or sets the start date.
        /// </summary>
        /// <value>
        /// The start date.
        /// </value>
        public string EndDate { get; set; }

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
        /// Gets or sets the type of the event sub.
        /// </summary>
        /// <value>
        /// The type of the event sub.
        /// </value>
        public string EventSubType { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has posted grades.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has posted grades; otherwise, <c>false</c>.
        /// </value>
        public bool HasPostedGrades { get; set; }

        /// <summary>
        /// Gets or sets the name of the instructor.
        /// </summary>
        /// <value>
        /// The name of the instructor.
        /// </value>
        public List<string> InstructorNames { get; set; }

        /// <summary>
        /// Gets or sets the section.
        /// </summary>
        /// <value>
        /// The section.
        /// </value>
        public string Section { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the start date.
        /// </summary>
        /// <value>
        /// The start date.
        /// </value>
        public string StartDate { get; set; }
    }
}