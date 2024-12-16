// --------------------------------------------------------------------
// <copyright file="BlockRegistrationGroupHeaderViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Administration
{
    /// <summary>
    /// BlockRegistrationGroupHeadersViewModel
    /// </summary>
    public class BlockRegistrationGroupHeadersViewModel
    {
        /// <summary>
        /// Gets or sets the block registration group header list.
        /// </summary>
        /// <value>
        /// The block registration group header list.
        /// </value>
        public List<BlockRegistrationGroupHeaderViewModel> BlockRegistrationGroupHeaderList { get; set; }

        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int OverallCount { get; set; }
    }

    /// <summary>
    /// BlockRegistrationGroupHeaderViewModel
    /// </summary>
    public class BlockRegistrationGroupHeaderViewModel
    {
        /// <summary>
        /// Gets or sets the block registration group identifier.
        /// </summary>
        /// <value>
        /// The block registration group identifier.
        /// </value>
        public int BlockRegistrationGroupId { get; set; }

        /// <summary>
        /// Gets or sets the create date time.
        /// </summary>
        /// <value>
        /// The create date time.
        /// </value>
        public string CreateDateTime { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is active; otherwise, <c>false</c>.
        /// </value>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets the display name.
        /// </summary>
        /// <value>
        /// The display name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int NumberOfSections { get; set; }

        /// <summary>
        /// Gets or sets the revision date time.
        /// </summary>
        /// <value>
        /// The revision date time.
        /// </value>
        public string RevisionDateTime { get; set; }

        /// <summary>
        /// Gets or sets the section list.
        /// </summary>
        /// <value>
        /// The section list.
        /// </value>
        public List<int> SectionIdList { get; set; }
    }

    /// <summary>
    /// BlockRegistrationGroupViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Administration.BlockRegistrationGroupHeaderViewModel" />
    public class BlockRegistrationGroupViewModel : BlockRegistrationGroupHeaderViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [allow changes].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [allow changes]; otherwise, <c>false</c>.
        /// </value>
        public bool? AllowChanges { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets a value indicating whether this instance is editable.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is editable; otherwise, <c>false</c>.
        /// </value>
        public bool IsEditable { get; internal set; }

        /// <summary>
        /// Gets or sets the term period identifier.
        /// </summary>
        /// <value>
        /// The term period identifier.
        /// </value>
        public int? TermPeriodId { get; set; }
    }
}