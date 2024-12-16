// --------------------------------------------------------------------
// <copyright file="ConEdSetupPermissions.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    public class ConEdSetupPermissions
    {
        /// <summary>
        /// Gets a value indicating whether [con ed defaults].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [con ed defaults]; otherwise, <c>false</c>.
        /// </value>
        public bool ConEdDefaults { get; internal set; }

        /// <summary>
        /// Gets a value indicating whether [con ed registration].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [con ed registration]; otherwise, <c>false</c>.
        /// </value>
        public bool ConEdRegistration { get; internal set; }
    }
}