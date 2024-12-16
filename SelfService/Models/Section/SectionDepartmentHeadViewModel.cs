// --------------------------------------------------------------------
// <copyright file="SectionDepartmentHeadViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionApprovalViewModel class
    /// </summary>
    /// <seealso cref="SelfService.Models.Section.SectionViewModel" />
    public class SectionApprovalViewModel : SectionViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [require approval].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [require approval]; otherwise, <c>false</c>.
        /// </value>
        public bool RequireApproval { get; set; }
    }

    /// <summary>
    /// SectionDepartmentHeadViewModel class
    /// </summary>
    public class SectionDepartmentHeadViewModel
    {
        /// <summary>
        /// Gets or sets the department desc.
        /// </summary>
        /// <value>
        /// The department desc.
        /// </value>
        public string DepartmentDesc { get; set; }

        /// <summary>
        /// Gets or sets the sections approval.
        /// </summary>
        /// <value>
        /// The sections approval.
        /// </value>
        public List<SectionApprovalViewModel> SectionsApproval { get; set; }
    }
}