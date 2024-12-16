// --------------------------------------------------------------------
// <copyright file="StudentFinancialAidModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Students
{
    /// <summary>
    /// StudentFinancialAidModel class
    /// </summary>
    public class StudentFinancialAidModel
    {
        /// <summary>
        /// Gets or sets the award year token.
        /// </summary>
        /// <value>
        /// The award year token.
        /// </value>
        public int AwardYearToken { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int? PersonId { get; set; }
    }
}