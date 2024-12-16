// --------------------------------------------------------------------
// <copyright file="ProfileSetupPermissions.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    /// <summary>
    /// ProfileSetupPermissions
    /// </summary>
    public class ProfileSetupPermissions
    {
        /// <summary>
        /// Gets or sets a value indicating whether [application forms setup].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [application forms setup]; otherwise, <c>false</c>.
        /// </value>
        public bool AddressSettings { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [demographic settings].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [demographic settings]; otherwise, <c>false</c>.
        /// </value>
        public bool DemographicSettings { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [emergency contact settings].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [emergency contact settings]; otherwise, <c>false</c>.
        /// </value>
        public bool EmergencyContactSettings { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [phone number].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [phone number]; otherwise, <c>false</c>.
        /// </value>
        public bool PhoneNumberSettings { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [preferred name].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [preferred name]; otherwise, <c>false</c>.
        /// </value>
        public bool PreferredNameSettings { get; set; }
    }
}