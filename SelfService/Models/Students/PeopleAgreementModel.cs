// --------------------------------------------------------------------
// <copyright file="PeopleAgreementModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Students
{
    /// <summary>
    /// PeopleAgreementModel class
    /// </summary>
    public class PeopleAgreementModel
    {
        /// <summary>
        /// Gets or sets the agreement identifier.
        /// </summary>
        /// <value>
        /// The agreement identifier.
        /// </value>
        public int AgreementId { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is accepted.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is accepted; otherwise, <c>false</c>.
        /// </value>
        public bool IsAccepted { get; set; }

        /// <summary>
        /// Gets or sets the year term.
        /// </summary>
        /// <value>
        /// The year term.
        /// </value>
        public string YearTerm { get; set; }
    }
}