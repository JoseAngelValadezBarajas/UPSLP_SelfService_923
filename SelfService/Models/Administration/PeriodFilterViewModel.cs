// --------------------------------------------------------------------
// <copyright file="PeriodFilterViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;

namespace SelfService.Models.Administration
{
    /// <summary>
    /// PeriodViewModel
    /// </summary>
    public class PeriodFilterViewModel
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is included.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is included; otherwise, <c>false</c>.
        /// </value>
        public bool IsIncluded { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is related included.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is related included; otherwise, <c>false</c>.
        /// </value>
        public bool IsRelatedIncluded { get; set; }

        /// <summary>
        /// Gets or sets the session desc.
        /// </summary>
        /// <value>
        /// The session desc.
        /// </value>
        public string Session { get; set; }

        /// <summary>
        /// Gets or sets the term desc.
        /// </summary>
        /// <value>
        /// The term desc.
        /// </value>
        public string Term { get; set; }
    }

    /// <summary>
    /// PeriodStatusViewModel
    /// </summary>
    public class PeriodStatusViewModel
    {
        /// <summary>
        /// Gets or sets the last registration date.
        /// </summary>
        /// <value>
        /// The last registration date.
        /// </value>
        public string LastRegistrationDate { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [people agreement status].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [people agreement status]; otherwise, <c>false</c>.
        /// </value>
        public bool PeopleAgreementStatus { get; set; }

        /// <summary>
        /// Gets or sets the pre registration date.
        /// </summary>
        /// <value>
        /// The pre registration date.
        /// </value>
        public string PreRegistrationDate { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public AuthorizationStatus Status { get; set; }

        /// <summary>
        /// Gets or sets the value.
        /// </summary>
        /// <value>
        /// The value.
        /// </value>
        public string Value { get; set; }
    }
}