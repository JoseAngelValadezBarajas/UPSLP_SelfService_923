// --------------------------------------------------------------------
// <copyright file="PasswordPolicyViewModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Enum;

namespace SelfService.Models.Account
{
    /// <summary>
    /// PasswordPolicyViewModel
    /// </summary>
    public class PasswordPolicyViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance can change password.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance can change password; otherwise, <c>false</c>.
        /// </value>
        public bool CanChangePassword { get; set; }

        /// <summary>
        /// Gets or sets the change password URL.
        /// </summary>
        /// <value>
        /// The change password URL.
        /// </value>
        public string ChangePasswordUrl { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [compare against previous password].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [compare against previous password]; otherwise, <c>false</c>.
        /// </value>
        public bool CompareAgainstPreviousPwd { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is lower case required.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is lower case required; otherwise, <c>false</c>.
        /// </value>
        public bool IsLowerCaseRequired { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is numbers required.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is numbers required; otherwise, <c>false</c>.
        /// </value>
        public bool IsNumbersRequired { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is special character required.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is special character required; otherwise, <c>false</c>.
        /// </value>
        public bool IsSpecialCharacterRequired { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is upper case required.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is upper case required; otherwise, <c>false</c>.
        /// </value>
        public bool IsUpperCaseRequired { get; set; }

        /// <summary>
        /// Gets or sets the minimum length.
        /// </summary>
        /// <value>
        /// The minimum length.
        /// </value>
        public byte MinimumLength { get; set; }

        /// <summary>
        /// Gets or sets the previous password number.
        /// </summary>
        /// <value>
        /// The previous password number.
        /// </value>
        public byte? PreviousPwdNumber { get; set; }

        /// <summary>
        /// Gets or sets the store mode.
        /// </summary>
        /// <value>
        /// The store mode.
        /// </value>
        public StoreMode StoreMode { get; set; }
    }
}