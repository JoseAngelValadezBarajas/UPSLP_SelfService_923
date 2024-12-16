// --------------------------------------------------------------------
// <copyright file="BlockRegistrationModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Schedule;

namespace SelfService.Models.Registration
{
    /// <summary>
    /// BlockRegistrationModel class
    /// </summary>
    public class BlockRegistrationModel
    {
        /// <summary>
        /// Gets or sets the block registration rule group identifier.
        /// </summary>
        /// <value>
        /// The block registration rule group identifier.
        /// </value>
        public int BlockRegistrationRuleGroupId { get; set; }

        /// <summary>
        /// Gets or sets the block reg rule group block identifier.
        /// </summary>
        /// <value>
        /// The block reg rule group block identifier.
        /// </value>
        public int BlockRegRuleGroupBlockId { get; set; }

        /// <summary>
        /// Gets or sets the year term.
        /// </summary>
        /// <value>
        /// The year term.
        /// </value>
        public YearTermModel YearTerm { get; set; }
    }
}