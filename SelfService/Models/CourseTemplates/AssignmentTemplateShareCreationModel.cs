// --------------------------------------------------------------------
// <copyright file="AssignmentTemplateShareCreationModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentTemplateShareCreationModel
    /// </summary>
    public class AssignmentTemplateShareCreationModel
    {
        /// <summary>
        /// Gets or sets the assignment template headers.
        /// </summary>
        /// <value>
        /// The assignment template headers.
        /// </value>
        public List<int> AssignmentTemplateHeaders { get; set; }

        /// <summary>
        /// Gets or sets the shared to.
        /// </summary>
        /// <value>
        /// The shared to.
        /// </value>
        public int SharedTo { get; set; }
    }
}