// --------------------------------------------------------------------
// <copyright file="Account.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Session
{
    /// <summary>
    /// AccountViewModel
    /// </summary>
    public class Account
    {
        /// <summary>
        /// Gets or sets the authentication mode.
        /// </summary>
        /// <value>
        /// The authentication mode.
        /// </value>
        public int AuthenticationMode { get; set; }

        /// <summary>
        /// Gets or sets the display name.
        /// </summary>
        /// <value>
        /// The display name.
        /// </value>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the language.
        /// </summary>
        /// <value>
        /// The language.
        /// </value>
        public string Language { get; set; }

        /// <summary>
        /// Gets or sets the people code identifier.
        /// </summary>
        /// <value>
        /// The people code identifier.
        /// </value>
        public string PeopleCodeId { get; set; }

        /// <summary>
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }

        /// <summary>
        /// Gets or sets the person id.
        /// </summary>
        /// <value>
        /// The person id.
        /// </value>
        public int PersonId { get; set; }

        /// <summary>
        /// Gets or sets the session timeout minutes.
        /// </summary>
        /// <value>
        /// The session timeout minutes.
        /// </value>
        public int SessionTimeoutMinutes { get; set; }

        /// <summary>
        /// Gets or sets the temporary email.
        /// </summary>
        /// <value>
        /// The temporary email.
        /// </value>
        public string TemporaryEmail { get; set; }

        /// <summary>
        /// Gets or sets the temporary user identifier.
        /// </summary>
        /// <value>
        /// The temporary user identifier.
        /// </value>
        public int TemporaryUserId { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <value>
        /// The name of the user.
        /// </value>
        public string UserName { get; set; }
    }
}