// --------------------------------------------------------------------
// <copyright file="ApprovalRequirementModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Section
{
    /// <summary>
    /// ApprovalRequirementModel
    /// </summary>
    public class ApprovalRequirementModel
    {
        /// <summary>
        /// Gets or sets the department position.
        /// </summary>
        /// <value>
        /// The department position.
        /// </value>
        public int DepartmentPosition { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [require approval].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [require approval]; otherwise, <c>false</c>.
        /// </value>
        public bool RequireApproval { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the section position.
        /// </summary>
        /// <value>
        /// The section position.
        /// </value>
        public int SectionPosition { get; set; }
    }
}