// --------------------------------------------------------------------
// <copyright file="ProfileAddressViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Account.MyProfile
{
    /// <summary>
    /// ProfileAddressDetailViewModel
    /// </summary>
    public class ProfileAddressDetailViewModel
    {
        /// <summary>
        /// Gets or sets the active date.
        /// </summary>
        /// <value>
        /// The active date.
        /// </value>
        public string ActiveDate { get; set; }

        /// <summary>
        /// Gets or sets the address approval request identifier.
        /// </summary>
        /// <value>
        /// The address approval request identifier.
        /// </value>
        public int? AddressApprovalRequestId { get; set; }

        /// <summary>
        /// Gets or sets the address line1.
        /// </summary>
        /// <value>
        /// The address line1.
        /// </value>
        public string AddressLine1 { get; set; }

        /// <summary>
        /// Gets or sets the address line2.
        /// </summary>
        /// <value>
        /// The address line2.
        /// </value>
        public string AddressLine2 { get; set; }

        /// <summary>
        /// Gets or sets the address line3.
        /// </summary>
        /// <value>
        /// The address line3.
        /// </value>
        public string AddressLine3 { get; set; }

        /// <summary>
        /// Gets or sets the address line4.
        /// </summary>
        /// <value>
        /// The address line4.
        /// </value>
        public string AddressLine4 { get; set; }

        /// <summary>
        /// Gets or sets the address line5.
        /// </summary>
        /// <value>
        /// The address line5.
        /// </value>
        public string AddressLine5 { get; set; }

        /// <summary>
        /// Gets the approved status.
        /// </summary>
        /// <value>
        /// The approved status.
        /// </value>
        public int ApprovedStatus { get; set; }

        /// <summary>
        /// Gets or sets the effective date.
        /// </summary>
        /// <value>
        /// The effective date.
        /// </value>
        public string EffectiveDate { get; set; }

        /// <summary>
        /// Gets or sets the house number.
        /// </summary>
        /// <value>
        /// The house number.
        /// </value>
        public string HouseNumber { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is current address.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is current address; otherwise, <c>false</c>.
        /// </value>
        public bool IsCurrentAddress { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is preferred.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is preferred; otherwise, <c>false</c>.
        /// </value>
        public bool IsPreferred { get; set; }

        /// <summary>
        /// Gets or sets the sequence number.
        /// </summary>
        /// <value>
        /// The sequence number.
        /// </value>
        public int? SequenceNumber { get; set; }
    }

    /// <summary>
    /// ProfileAddressViewModel
    /// </summary>
    public class ProfileAddressViewModel
    {
        /// <summary>
        /// Gets or sets the addresses.
        /// </summary>
        /// <value>
        /// The addresses.
        /// </value>
        public List<ProfileAddressDetailViewModel> Addresses { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is preferred.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is preferred; otherwise, <c>false</c>.
        /// </value>
        public bool IsPreferred { get; set; }

        /// <summary>
        /// Gets or sets the type desc.
        /// </summary>
        /// <value>
        /// The type desc.
        /// </value>
        public string TypeDesc { get; set; }

        /// <summary>
        /// Gets or sets the type identifier.
        /// </summary>
        /// <value>
        /// The type identifier.
        /// </value>
        public int TypeId { get; set; }
    }
}