// --------------------------------------------------------------------
// <copyright file="PasswordChange.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Account.MyProfile
{
    /// <summary>
    /// PasswordChangeModel
    /// </summary>
    public class PasswordChangeModel
    {
        /// <summary>
        /// Gets or sets the current password.
        /// </summary>
        /// <value>
        /// The current password.
        /// </value>
        public string CurrentPassword { get; set; }

        /// <summary>
        /// Creates new password.
        /// </summary>
        /// <value>
        /// The new password.
        /// </value>
        public string NewPassword { get; set; }

        /// <summary>
        /// Gets or sets the recovery code.
        /// </summary>
        /// <value>
        /// The recovery code.
        /// </value>
        public string RecoveryCode { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <value>
        /// The name of the user.
        /// </value>
        public string UserName { get; set; }
    }
}