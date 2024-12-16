// --------------------------------------------------------------------
// <copyright file="PasswordModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Account
{
    /// <summary>
    /// PasswordModel
    /// </summary>
    public class PasswordModel
    {
        /// <summary>
        /// Gets or sets the name of the area.
        /// </summary>
        /// <value>
        /// The name of the area.
        /// </value>
        public string AreaName { get; set; }

        /// <summary>
        /// Gets or sets the password.
        /// </summary>
        /// <value>
        /// The password.
        /// </value>
        public string Password { get; set; }
    }
}