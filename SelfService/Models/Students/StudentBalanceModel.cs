// --------------------------------------------------------------------
// <copyright file="StudentBalanceModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Students
{
    /// <summary>
    /// StudentBalanceModel class
    /// </summary>
    public class StudentBalanceModel
    {
        /// <summary>
        /// Gets or sets the option.
        /// </summary>
        /// <value>
        /// The option.
        /// </value>
        public string Option { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int? PersonId { get; set; }

        /// <summary>
        /// Gets or sets the year term session.
        /// </summary>
        /// <value>
        /// The year term session.
        /// </value>
        public string YearTermSession { get; set; }
    }
}