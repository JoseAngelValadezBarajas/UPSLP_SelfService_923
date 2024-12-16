// --------------------------------------------------------------------
// <copyright file="ForgotPasswordViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.SignIn
{
    public class ForgotPasswordViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [enable password reset].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [enable password reset]; otherwise, <c>false</c>.
        /// </value>
        public bool EnablePasswordReset { get; set; }

        /// <summary>
        /// Gets or sets the password reset URL.
        /// </summary>
        /// <value>
        /// The password reset URL.
        /// </value>
        public string PasswordResetURL { get; set; }
    }
}