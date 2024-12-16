// --------------------------------------------------------------------
// <copyright file="ProfilePermissions.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    /// <summary>
    /// ProfilePermissions
    /// </summary>
    public class ProfilePermissions
    {
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ProfilePermissions"/> is account.
        /// </summary>
        /// <value>
        ///   <c>true</c> if account; otherwise, <c>false</c>.
        /// </value>
        public bool Account { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ProfilePermissions"/> is addresses.
        /// </summary>
        /// <value>
        ///   <c>true</c> if addresses; otherwise, <c>false</c>.
        /// </value>
        public bool Addresses { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ProfilePermissions"/> is agreements.
        /// </summary>
        /// <value>
        ///   <c>true</c> if agreements; otherwise, <c>false</c>.
        /// </value>
        public bool Agreements { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [change password].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [change password]; otherwise, <c>false</c>.
        /// </value>
        public bool ChangePassword { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ProfilePermissions"/> is demographic.
        /// </summary>
        /// <value>
        ///   <c>true</c> if demographic; otherwise, <c>false</c>.
        /// </value>
        public bool Demographic { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [emergency contacts].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [emergency contacts]; otherwise, <c>false</c>.
        /// </value>
        public bool EmergencyContacts { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [ethnicity and race].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [ethnicity and race]; otherwise, <c>false</c>.
        /// </value>
        public bool EthnicityAndRace { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [phone numbers].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [phone numbers]; otherwise, <c>false</c>.
        /// </value>
        public bool PhoneNumbers { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [preferred name].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [preferred name]; otherwise, <c>false</c>.
        /// </value>
        public bool PreferredName { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ProfilePermissions"/> is profile.
        /// </summary>
        /// <value>
        ///   <c>true</c> if profile; otherwise, <c>false</c>.
        /// </value>
        public bool Profile { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [user has permission to registration summary].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [user has permission to registration summary]; otherwise, <c>false</c>.
        /// </value>
        public bool RegistrationSummary { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [shared access].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [shared access]; otherwise, <c>false</c>.
        /// </value>
        public bool SharedAccess { get; set; }
    }
}