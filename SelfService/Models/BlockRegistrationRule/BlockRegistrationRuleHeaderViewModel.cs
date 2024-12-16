// --------------------------------------------------------------------
// <copyright file="BlockRegistrationRuleHeaderViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Administration
{
    /// <summary>
    /// BlockRegistrationRuleDetailViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Administration.BlockRegistrationRuleHeaderViewModel" />
    public class BlockRegistrationRuleDetailViewModel : BlockRegistrationRuleHeaderViewModel
    {
        /// <summary>
        /// Gets or sets the block registration rule group list.
        /// </summary>
        /// <value>
        /// The block registration rule group list.
        /// </value>
        public List<BlockRegistrationRuleGroupViewModel> BlockRegRuleGroups { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is block registration only.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is block registration only; otherwise, <c>false</c>.
        /// </value>
        public bool IsBlockRegistrationOnly { get; set; }

        /// <summary>
        /// Gets or sets the term period identifier.
        /// </summary>
        /// <value>
        /// The term period identifier.
        /// </value>
        public int TermPeriodId { get; set; }

        /// <summary>
        /// Gets or sets the name of the view.
        /// </summary>
        /// <value>
        /// The name of the view.
        /// </value>
        public string ViewName { get; set; }
    }

    /// <summary>
    /// BlockRegistrationRuleGroupViewModel
    /// </summary>
    public class BlockRegistrationRuleGroupViewModel
    {
        /// <summary>
        /// Gets or sets the block details.
        /// </summary>
        /// <value>
        /// The block details.
        /// </value>
        public List<BlockRegRuleGroupBlockViewModel> BlockDetails { get; set; }

        /// <summary>
        /// Gets or sets the block registration rule group identifier.
        /// </summary>
        /// <value>
        /// The block registration rule group identifier.
        /// </value>
        public int BlockRegistrationRuleGroupId { get; set; }

        /// <summary>
        /// Gets or sets the display name.
        /// </summary>
        /// <value>
        /// The display name.
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
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the number of blocks.
        /// </summary>
        /// <value>
        /// The number of blocks.
        /// </value>
        public int NumberOfBlocks { get; set; }

        /// <summary>
        /// Gets or sets the order.
        /// </summary>
        /// <value>
        /// The order.
        /// </value>
        public short Order { get; set; }
    }

    /// <summary>
    /// BlockRegistrationRuleHeadersViewModel
    /// </summary>
    public class BlockRegistrationRuleHeadersViewModel
    {
        /// <summary>
        /// Gets or sets the block registration rule header list.
        /// </summary>
        /// <value>
        /// The block registration rule header list.
        /// </value>
        public List<BlockRegistrationRuleHeaderViewModel> BlockRegistrationRuleHeaderList { get; set; }

        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int OverallCount { get; set; }
    }

    /// <summary>
    /// BlockRegistrationRuleHeaderViewModel
    /// </summary>
    public class BlockRegistrationRuleHeaderViewModel
    {
        /// <summary>
        /// Gets or sets the block registration rule identifier.
        /// </summary>
        /// <value>
        /// The block registration rule identifier.
        /// </value>
        public int BlockRegistrationRuleId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is active; otherwise, <c>false</c>.
        /// </value>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the priority.
        /// </summary>
        /// <value>
        /// The priority.
        /// </value>
        public int Priority { get; set; }
    }

    /// <summary>
    /// BlockRegRuleGroupBlockViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Administration.BlockRegistrationGroupHeaderViewModel" />
    public class BlockRegRuleGroupBlockViewModel : BlockRegistrationGroupHeaderViewModel
    {
        /// <summary>
        /// Gets or sets the block reg rule group block identifier.
        /// </summary>
        /// <value>
        /// The block reg rule group block identifier.
        /// </value>
        public int BlockRegRuleGroupBlockId { get; set; }
    }
}