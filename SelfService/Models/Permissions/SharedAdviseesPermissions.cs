// --------------------------------------------------------------------
// <copyright file="SharedAdviseesPermissions.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    public class SharedAdviseesPermissions
    {
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="SharedAdviseesPermissions"/> is dossier.
        /// </summary>
        /// <value>
        ///   <c>true</c> if dossier; otherwise, <c>false</c>.
        /// </value>
        public bool Dossier { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [faculty dossier].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [faculty dossier]; otherwise, <c>false</c>.
        /// </value>
        public bool FacultyDossier { get; set; }
    }
}