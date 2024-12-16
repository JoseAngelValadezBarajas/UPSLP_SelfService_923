// --------------------------------------------------------------------
// <copyright file="OfficeModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using System.Collections.Generic;

namespace SelfService.Models.Administration
{
    /// <summary>
    /// OfficeModel class
    /// </summary>
    public class OfficeModel
    {
        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int PersonId { get; set; }

        /// <summary>
        /// Gets or sets the staff permissions.
        /// </summary>
        /// <value>
        /// The staff permissions.
        /// </value>
        public List<OfficeStaffPermission> StaffPermissions { get; set; }
    }
}