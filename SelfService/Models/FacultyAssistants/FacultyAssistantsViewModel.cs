// --------------------------------------------------------------------
// <copyright file="FacultyAssistantsViewModel.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.FacultyAssistants
{
    /// <summary>
    /// FacultyAssistantsViewModel
    /// </summary>
    public class FacultyAssistantsViewModel
    {
        /// <summary>
        /// Gets or sets the email settings.
        /// </summary>
        /// <value>
        /// The email settings.
        /// </value>
        public EmailSettingsViewModel EmailSettings { get; set; }

        /// <summary>
        /// Gets or sets the faculty assistants.
        /// </summary>
        /// <value>
        /// The faculty assistants.
        /// </value>
        public List<FacultyAssistantDetailViewModel> FacultyAssistants { get; set; }
    }
}