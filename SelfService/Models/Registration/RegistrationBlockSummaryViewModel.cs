// --------------------------------------------------------------------
// <copyright file="RegistrationBlockSummaryViewModel.cs" company="Ellucian">
//     Copyright 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Registration
{
    /// <summary>
    /// The registration block summary view model class.
    /// </summary>
    public class RegistrationBlockSummaryViewModel
    {
        /// <summary>
        /// Gets or sets the display name of the block.
        /// </summary>
        /// <value>
        /// The display name of the block.
        /// </value>
        public string BlockDisplayName { get; set; }

        /// <summary>
        /// Gets or sets the display name of the group.
        /// </summary>
        /// <value>
        /// The display name of the group.
        /// </value>
        public string GroupDisplayName { get; set; }

        /// <summary>
        /// Gets or sets the sections.
        /// </summary>
        /// <value>
        /// The sections.
        /// </value>
        public List<RegistrationSectionSummaryViewModel> Sections { get; set; }
    }
}