// --------------------------------------------------------------------
// <copyright file="WaitlistStatusEditModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// WaitlistStatusEditModel
    /// </summary>
    public class WaitlistStatusEditModel
    {
        /// <summary>
        /// Gets or sets the person ids.
        /// </summary>
        /// <value>
        /// The person ids.
        /// </value>
        public List<int> PersonIds { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }
    }
}