// --------------------------------------------------------------------
// <copyright file="AddressChangeRequestModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Students;

namespace SelfService.Models.Administration.Requests
{
    /// <summary>
    /// AddressApprovalModel class
    /// </summary>
    public class AddressChangeRequestModel
    {
        /// <summary>
        /// Gets or sets the address detail.
        /// </summary>
        /// <value>
        /// The address detail.
        /// </value>
        public AddressDetailViewModel AddressDetail { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int? PersonId { get; set; }

        /// <summary>
        /// Gets or sets the request number.
        /// </summary>
        /// <value>
        /// The request number.
        /// </value>
        public int RequestNumber { get; set; }
    }
}