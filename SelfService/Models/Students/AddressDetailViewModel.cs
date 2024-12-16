// --------------------------------------------------------------------
// <copyright file="AddressDetailViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;

namespace SelfService.Models.Students
{
    /// <summary>
    /// AddressDetailViewModel
    /// </summary>
    public class AddressDetailViewModel
    {
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
        /// Gets or sets the addess type desc.
        /// </summary>
        /// <value>
        /// The addess type desc.
        /// </value>
        public string AddressTypeDesc { get; set; }

        /// <summary>
        /// Gets or sets the address type identifier.
        /// </summary>
        /// <value>
        /// The address type identifier.
        /// </value>
        public int AddressTypeId { get; set; }

        /// <summary>
        /// Gets or sets the city.
        /// </summary>
        /// <value>
        /// The city.
        /// </value>
        public string City { get; set; }

        /// <summary>
        /// Gets or sets the country desc.
        /// </summary>
        /// <value>
        /// The country desc.
        /// </value>
        public string CountryDesc { get; set; }

        /// <summary>
        /// Gets or sets the country identifier.
        /// </summary>
        /// <value>
        /// The country identifier.
        /// </value>
        public int? CountryId { get; set; }

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
        /// Gets a value indicating whether this instance is preferred.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is preferred; otherwise, <c>false</c>.
        /// </value>
        public bool IsPreferred { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is recurring.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is recurring; otherwise, <c>false</c>.
        /// </value>
        public bool IsRecurring { get; set; }

        /// <summary>
        /// Gets or sets the sequence number.
        /// </summary>
        /// <value>
        /// The sequence number.
        /// </value>
        public int SequenceNumber { get; set; }

        /// <summary>
        /// Gets the start date.
        /// </summary>
        /// <value>
        /// The start date.
        /// </value>
        public string StartDate { get; internal set; }

        /// <summary>
        /// Gets or sets the state desc.
        /// </summary>
        /// <value>
        /// The state desc.
        /// </value>
        public string StateDesc { get; set; }

        /// <summary>
        /// Gets or sets the state province identifier.
        /// </summary>
        /// <value>
        /// The state province identifier.
        /// </value>
        public int? StateProvinceId { get; set; }

        /// <summary>
        /// Gets or sets the zip code.
        /// </summary>
        /// <value>
        /// The zip code.
        /// </value>
        public string ZipCode { get; set; }
    }

    /// <summary>
    /// AddressRequestApproveModel
    /// </summary>
    public class AddressRequestApproveModel
    {
        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }

        /// <summary>
        /// Gets or sets the request identifier.
        /// </summary>
        /// <value>
        /// The request identifier.
        /// </value>
        public int RequestId { get; set; }
    }

    /// <summary>
    /// AddressRequestViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Students.AddressDetailViewModel" />
    public class AddressRequestViewModel
    {
        /// <summary>
        /// Gets or sets the address approval request identifier.
        /// </summary>
        /// <value>
        /// The address approval request identifier.
        /// </value>
        public int AddressApprovalRequestId { get; set; }

        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>
        /// The full name.
        /// </value>
        public AvatarViewModel Avatar { get; set; }

        /// <summary>
        /// Gets or sets the current address.
        /// </summary>
        /// <value>
        /// The current address.
        /// </value>
        public AddressDetailViewModel CurrentAddress { get; set; }

        /// <summary>
        /// Gets a value indicating whether this instance has picture.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has picture; otherwise, <c>false</c>.
        /// </value>
        public bool HasPicture { get; set; }

        /// <summary>
        /// Gets or sets the old address detail.
        /// </summary>
        /// <value>
        /// The old address detail.
        /// </value>
        public AddressDetailViewModel NewAddress { get; set; }

        /// <summary>
        /// Gets or sets the people id.
        /// </summary>
        /// <value>
        /// The people id.
        /// </value>
        public string PeopleId { get; set; }

        /// <summary>
        /// Gets or sets the request date.
        /// </summary>
        /// <value>
        /// The request date.
        /// </value>
        public string RequestDate { get; set; }
    }
}