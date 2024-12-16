// --------------------------------------------------------------------
// <copyright file="TemplateOptionsModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// TemplateOptionsModel
    /// </summary>
    public class TemplateOptionsModel
    {
        /// <summary>
        /// Gets or sets the assignment template header.
        /// </summary>
        /// <value>
        /// The assignment template header.
        /// </value>
        public int AssignmentTemplateHeader { get; set; }

        /// <summary>
        /// Gets or sets the session period identifier.
        /// </summary>
        /// <value>
        /// The session period identifier.
        /// </value>
        public int SessionPeriodId { get; set; }
    }
}