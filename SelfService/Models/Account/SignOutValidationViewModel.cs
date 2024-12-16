// --------------------------------------------------------------------
// <copyright file="SignOutValidationViewModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System;

namespace SelfService.Models.Account
{
    /// <summary>
    /// SignOutRedirectLocation
    /// </summary>
    public enum SignOutRedirectLocation
    {
        /// <summary>
        /// The default
        /// </summary>
        Default = 0,

        /// <summary>
        /// The recover password
        /// </summary>
        RecoverPassword = 1,

        /// <summary>
        /// The invitation confirmation
        /// </summary>
        InvitationConfirmation = 2
    }

    /// <summary>
    /// SignOutValidationViewModel
    /// </summary>
    public class SignOutValidationViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance is same user.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is same user; otherwise, <c>false</c>.
        /// </value>
        public bool IsSameUser { get; set; }

        /// <summary>
        /// Gets or sets the name of the logged user.
        /// </summary>
        /// <value>
        /// The name of the logged user.
        /// </value>
        public string LoggedUserName { get; set; }

        /// <summary>
        /// Gets or sets the redirect location.
        /// </summary>
        /// <value>
        /// The redirect location.
        /// </value>
        public SignOutRedirectLocation RedirectLocation { get; set; }

        /// <summary>
        /// Gets or sets the token.
        /// </summary>
        /// <value>
        /// The token.
        /// </value>
        public Guid Token { get; set; }
    }
}