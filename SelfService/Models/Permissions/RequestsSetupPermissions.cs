// --------------------------------------------------------------------
// <copyright file="RequestsSetupPermissions.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    public class RequestsSetupPermissions
    {
        /// <summary>
        /// Gets or sets a value indicating whether [address requests].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [address requests]; otherwise, <c>false</c>.
        /// </value>
        public bool AddressRequests { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [demographic requests].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [demographic requests]; otherwise, <c>false</c>.
        /// </value>
        public bool DemographicRequests { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [gender requests].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [gender requests]; otherwise, <c>false</c>.
        /// </value>
        public bool PreferredNameRequests { get; set; }
    }
}