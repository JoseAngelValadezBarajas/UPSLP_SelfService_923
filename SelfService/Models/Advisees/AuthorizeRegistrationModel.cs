// --------------------------------------------------------------------
// <copyright file="AuthorizeRegistrationModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AuthorizeRegistrationModel
    /// </summary>
    public class AuthorizeRegistrationModel
    {
        /// <summary>
        /// Gets or sets the authorization registration identifier.
        /// </summary>
        /// <value>
        /// The authorization registration identifier.
        /// </value>
        public int? AuthorizationRegistrationId { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }

        /// <summary>
        /// Gets or sets the session period identifier.
        /// </summary>
        /// <value>
        /// The session period identifier.
        /// </value>
        public int SessionPeriodId { get; set; }
    }
}