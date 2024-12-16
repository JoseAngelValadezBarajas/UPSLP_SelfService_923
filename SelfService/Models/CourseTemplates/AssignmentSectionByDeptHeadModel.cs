// --------------------------------------------------------------------
// <copyright file="AssignmentSectionByDeptHeadModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentSectionByDeptHeadModel
    /// </summary>
    public class AssignmentSectionByDeptHeadModel
    {
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

        /// <summary>
        /// Gets or sets the template identifier.
        /// </summary>
        /// <value>
        /// The template identifier.
        /// </value>
        public int TemplateId { get; set; }
    }
}