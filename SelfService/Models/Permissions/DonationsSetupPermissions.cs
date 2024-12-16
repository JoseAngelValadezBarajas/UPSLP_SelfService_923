// --------------------------------------------------------------------
// <copyright file="DonationSetupPermissions.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    public class DonationSetupPermissions
    {
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="DonationSetupPermissions"/> is campaigns.
        /// </summary>
        /// <value>
        ///   <c>true</c> if campaigns; otherwise, <c>false</c>.
        /// </value>
        public bool Campaigns { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="DonationSetupPermissions"/> is forms.
        /// </summary>
        /// <value>
        ///   <c>true</c> if forms; otherwise, <c>false</c>.
        /// </value>
        public bool Form { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [gift batch defaults].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [gift batch defaults]; otherwise, <c>false</c>.
        /// </value>
        public bool GiftBatchDefaults { get; set; }
    }
}