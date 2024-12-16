// --------------------------------------------------------------------
// <copyright file="BlockRegistrationPermissions.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    public class BlockRegistrationPermissions
    {
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="BlockRegistrationPermissions"/> is blocks.
        /// </summary>
        /// <value>
        ///   <c>true</c> if blocks; otherwise, <c>false</c>.
        /// </value>
        public bool Blocks { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="BlockRegistrationPermissions"/> is rules.
        /// </summary>
        /// <value>
        ///   <c>true</c> if rules; otherwise, <c>false</c>.
        /// </value>
        public bool Rules { get; set; }
    }
}