// --------------------------------------------------------------------
// <copyright file="ProfilePhoneViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Account.MyProfile
{
    /// <summary>
    /// ProfilePhoneViewModel
    /// </summary>
    public class ProfilePhoneViewModel
    {
        /// <summary>
        /// Gets or sets the country desc.
        /// </summary>
        /// <value>
        /// The country desc.
        /// </value>
        public string CountryDesc { get; set; }

        /// <summary>
        /// Gets or sets the country.
        /// </summary>
        /// <value>
        /// The country.
        /// </value>
        public int CountryId { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the do not call reason desc.
        /// </summary>
        /// <value>
        /// The do not call reason desc.
        /// </value>
        public string DoNotCallReasonDesc { get; set; }

        /// <summary>
        /// Gets or sets the format.
        /// </summary>
        /// <value>
        /// The format.
        /// </value>
        public string Format { get; set; }

        /// <summary>
        /// Gets or sets the formatted number.
        /// </summary>
        /// <value>
        /// The formatted number.
        /// </value>
        public string FormattedNumber { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is primary.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is primary; otherwise, <c>false</c>.
        /// </value>
        public bool IsPrimary { get; set; }

        /// <summary>
        /// Gets or sets the number.
        /// </summary>
        /// <value>
        /// The number.
        /// </value>
        public string Number { get; set; }

        /// <summary>
        /// Gets or sets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        public string Type { get; set; }

        /// <summary>
        /// Gets or sets the type desc.
        /// </summary>
        /// <value>
        /// The type desc.
        /// </value>
        public string TypeDesc { get; set; }
    }
}