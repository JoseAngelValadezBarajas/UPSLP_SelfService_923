// --------------------------------------------------------------------
// <copyright file="StaffPermissionViewModel.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Administration
{
    public class StaffPermissionViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance can edit tasks.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance can edit tasks; otherwise, <c>false</c>.
        /// </value>
        public bool CanEditTasks { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance can view notes.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance can view notes; otherwise, <c>false</c>.
        /// </value>
        public bool CanViewNotes { get; set; }

        /// <summary>
        /// Gets or sets the office desc.
        /// </summary>
        /// <value>
        /// The office desc.
        /// </value>
        public string OfficeDesc { get; set; }

        /// <summary>
        /// Gets or sets the office identifier.
        /// </summary>
        /// <value>
        /// The office identifier.
        /// </value>
        public int OfficeId { get; set; }

        /// <summary>
        /// Gets or sets the staff member identifier.
        /// </summary>
        /// <value>
        /// The staff member identifier.
        /// </value>
        public int StaffMemberId { get; set; }
    }
}