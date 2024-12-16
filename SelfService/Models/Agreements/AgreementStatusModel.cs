// --------------------------------------------------------------------
// <copyright file="AgreementStatusModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;

namespace SelfService.Models.Agreements
{
    /// <summary>
    /// AgreementStatusModel class
    /// </summary>
    public class AgreementStatusModel
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public AgreementStatus Status { get; set; }
    }
}