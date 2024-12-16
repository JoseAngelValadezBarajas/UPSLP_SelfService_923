// --------------------------------------------------------------------
// <copyright file="BlockRegistrationRuleStatusModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Administration
{
    /// <summary>
    /// BlockRegistrationRuleStatusModel class
    /// </summary>
    public class BlockRegistrationRuleStatusModel
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
    }
}