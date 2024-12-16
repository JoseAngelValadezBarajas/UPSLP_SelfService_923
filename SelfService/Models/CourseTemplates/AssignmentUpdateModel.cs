// --------------------------------------------------------------------
// <copyright file="AssignmentUpdateModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.CourseTemplates
{
    /// <summary>
    /// AssignmentUpdateModel
    /// </summary>
    public class AssignmentUpdateModel
    {
        /// <summary>
        /// Gets or sets the assignment list.
        /// </summary>
        /// <value>
        /// The assignment list.
        /// </value>
        public List<AssignmentTemplateModel> AssignmentList { get; set; }

        /// <summary>
        /// Gets or sets the assignment type list.
        /// </summary>
        /// <value>
        /// The assignment type list.
        /// </value>
        public List<AssignmentTypeRuleModel> AssignmentTypeList { get; set; }
    }
}