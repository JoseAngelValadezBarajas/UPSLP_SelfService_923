// --------------------------------------------------------------------
// <copyright file="BlockRegistrationGroupDetailViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Section;
using System.Collections.Generic;

namespace SelfService.Models.Administration
{
    /// <summary>
    /// BlockRegistrationGroupHeadersViewModel
    /// </summary>
    public class BlockRegistrationGroupDetailViewModel
    {
        /// <summary>
        /// Gets or sets the block registration group.
        /// </summary>
        /// <value>
        /// The block registration group.
        /// </value>
        public BlockRegistrationGroupViewModel BlockRegistrationGroup { get; set; }

        /// <summary>
        /// Gets or sets the section list.
        /// </summary>
        /// <value>
        /// The section list.
        /// </value>
        public List<SectionViewModel> SectionList { get; set; }
    }

    /// <summary>
    /// BlockRegRuleGroupViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Administration.BlockRegistrationGroupDetailViewModel" />
    public class BlockRegRuleGroupViewModel : BlockRegistrationGroupDetailViewModel
    {
        /// <summary>
        /// Gets or sets the block reg rule group block identifier.
        /// </summary>
        /// <value>
        /// The block reg rule group block identifier.
        /// </value>
        public int BlockRegRuleGroupBlockId { get; set; }

        /// <summary>
        /// Gets or sets the total credits.
        /// </summary>
        /// <value>
        /// The total credits.
        /// </value>
        public string TotalCredits { get; set; }
    }
}