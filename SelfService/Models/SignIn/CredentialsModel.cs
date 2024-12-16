// --------------------------------------------------------------------
// <copyright file="CredentialsModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.SignIn
{
    /// <summary>
    /// CredentialsModel
    /// </summary>
    public class CredentialsModel
    {
        /// <summary>
        /// Gets or sets the password.
        /// </summary>
        /// <value>
        /// The password.
        /// </value>
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <value>
        /// The name of the user.
        /// </value>
        public string UserName { get; set; }
    }
}