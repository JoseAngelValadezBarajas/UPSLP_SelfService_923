// --------------------------------------------------------------------
// <copyright file="PasswordPolicyModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Account
{
    /// <summary>
    /// PasswordPolicyModel
    /// </summary>
    public class PasswordPolicyModel
    {
        /// <summary>
        /// Gets or sets the application area.
        /// </summary>
        /// <value>
        /// The application area.
        /// </value>
        public string AppArea { get; set; }

        /// <summary>
        /// Gets or sets the application identifier.
        /// </summary>
        /// <value>
        /// The application identifier.
        /// </value>
        public int ApplicationId { get; set; }

        /// <summary>
        /// Gets or sets the application user identifier.
        /// </summary>
        /// <value>
        /// The application user identifier.
        /// </value>
        public int AppUserId { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <value>
        /// The name of the user.
        /// </value>
        public string UserName { get; set; }
    }
}