// --------------------------------------------------------------------
// <copyright file="SamlResponse.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Responses
{
    /// <summary>
    /// SamlResponse
    /// </summary>
    public class SamlResponse
    {
        /// <summary>
        /// Gets or sets the state of the relay.
        /// </summary>
        /// <value>
        /// The state of the relay.
        /// </value>
        public string RelayState { get; set; }

        /// <summary>
        /// Gets or sets the saml response.
        /// </summary>
        /// <value>
        /// The saml response.
        /// </value>
        public string SAMLResponse { get; set; }
    }
}