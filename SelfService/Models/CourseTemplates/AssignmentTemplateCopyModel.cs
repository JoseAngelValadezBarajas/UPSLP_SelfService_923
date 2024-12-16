// --------------------------------------------------------------------
// <copyright file="AssignmentTemplateCopyModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentTemplateCopyModel
    /// </summary>
    public class AssignmentTemplateCopyModel
    {
        /// <summary>
        /// Gets or sets from template identifier.
        /// </summary>
        /// <value>
        /// From template identifier.
        /// </value>
        public int FromTemplateId { get; set; }

        /// <summary>
        /// Converts to templateid.
        /// </summary>
        /// <value>
        /// To template identifier.
        /// </value>
        public int ToTemplateId { get; set; }
    }
}