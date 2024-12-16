// --------------------------------------------------------------------
// <copyright file="AssignmentCreationModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentCreationModel
    /// </summary>
    public class AssignmentCreationModel
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

        /// <summary>
        /// Gets or sets a value indicating whether [use manual weights].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [use manual weights]; otherwise, <c>false</c>.
        /// </value>
        public bool UseManualWeights { get; set; }
    }
}