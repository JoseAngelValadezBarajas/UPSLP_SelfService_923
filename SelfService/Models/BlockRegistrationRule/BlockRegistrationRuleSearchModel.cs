// --------------------------------------------------------------------
// <copyright file="BlockRegistrationRuleSearchModel.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Pagination;

namespace SelfService.Models.Administration
{
    /// <summary>
    /// BlockRegistrationRuleSearchModel
    /// </summary>
    public class BlockRegistrationRuleSearchModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the term period identifier.
        /// </summary>
        /// <value>
        /// The term period identifier.
        /// </value>
        public int TermPeriodId { get; set; }
    }
}