// --------------------------------------------------------------------
// <copyright file="SectionAssignmentStatusModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// SectionAssignmentStatusModel
    /// </summary>
    public class SectionAssignmentStatusModel
    {
        /// <summary>
        /// Gets or sets the assignment search.
        /// </summary>
        /// <value>
        /// The assignment search.
        /// </value>
        public AssignmentSearch AssignmentSearch { get; set; }

        /// <summary>
        /// Gets or sets the length.
        /// </summary>
        /// <value>
        /// The length.
        /// </value>
        public int Length { get; set; }

        /// <summary>
        /// Gets or sets the start index.
        /// </summary>
        /// <value>
        /// The start index.
        /// </value>
        public int StartIndex { get; set; }
    }
}