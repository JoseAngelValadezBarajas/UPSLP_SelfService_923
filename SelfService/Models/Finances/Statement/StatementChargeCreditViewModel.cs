// --------------------------------------------------------------------
// <copyright file="StatementChargeCreditViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Finances;

namespace SelfService.Models.Statement
{
    /// <summary>
    /// StatementChargeCreditViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Finances.ChargeCreditViewModel" />
    public class StatementChargeCreditViewModel : ChargeCreditViewModel
    {
        /// <summary>
        /// Gets or sets the type of the line.
        /// </summary>
        /// <value>
        /// The type of the line.
        /// </value>
        public string LineType { get; set; }

        /// <summary>
        /// Gets or sets the statement message.
        /// </summary>
        /// <value>
        /// The statement message.
        /// </value>
        public string StatementMessage { get; set; }
    }
}