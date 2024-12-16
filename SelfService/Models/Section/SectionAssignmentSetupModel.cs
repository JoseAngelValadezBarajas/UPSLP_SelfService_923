// --------------------------------------------------------------------
// <copyright file="SectionAssignmentSetupModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionAssignmentSetupModel
    /// </summary>
    public class SectionAssignmentSetupModel
    {
        /// <summary>
        /// Gets or sets the assignment types.
        /// </summary>
        /// <value>
        /// The assignment types.
        /// </value>
        public List<AssignmentTypeModel> AssignmentTypes { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }
    }
}