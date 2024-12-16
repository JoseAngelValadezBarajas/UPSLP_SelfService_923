// --------------------------------------------------------------------
// <copyright file="ChecklistPermissions.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Permissions
{
    public class ChecklistPermissions
    {
        /// <summary>
        /// Gets or sets a value indicating whether [create action].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [create action]; otherwise, <c>false</c>.
        /// </value>
        public bool CreateAction { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [edit action].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [edit action]; otherwise, <c>false</c>.
        /// </value>
        public bool EditAction { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [view notes].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [view notes]; otherwise, <c>false</c>.
        /// </value>
        public bool ViewNotes { get; set; }
    }
}