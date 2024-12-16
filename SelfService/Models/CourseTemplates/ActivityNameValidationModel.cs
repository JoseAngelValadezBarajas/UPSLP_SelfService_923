// --------------------------------------------------------------------
// <copyright file="AssignmentNameValidationModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentNameValidationModel
    /// </summary>
    public class AssignmentNameValidationModel
    {
        /// <summary>
        /// Gets or sets the assignment.
        /// </summary>
        /// <value>
        /// The assignment.
        /// </value>
        public AssignmentTemplateDetailModel Assignment { get; set; }

        /// <summary>
        /// Gets or sets the template identifier.
        /// </summary>
        /// <value>
        /// The template identifier.
        /// </value>
        public int TemplateId { get; set; }
    }
}