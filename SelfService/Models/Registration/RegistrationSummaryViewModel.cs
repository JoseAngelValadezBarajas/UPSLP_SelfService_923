// --------------------------------------------------------------------
// <copyright file="RegistrationSummaryViewModel.cs" company="Ellucian">
//     Copyright 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Registration
{
    /// <summary>
    /// The registration summary view model class.
    /// </summary>
    public class RegistrationSummaryViewModel
    {
        /// <summary>
        /// Gets or sets the blocks.
        /// </summary>
        /// <value>
        /// The blocks.
        /// </value>
        public List<RegistrationBlockSummaryViewModel> Blocks { get; set; }

        /// <summary>
        /// Gets or sets the creation datetime.
        /// </summary>
        /// <value>
        /// The creation datetime.
        /// </value>
        public string CreationDatetime { get; set; }

        /// <summary>
        /// Gets or sets the registration log identifier.
        /// </summary>
        /// <value>
        /// The registration log identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the sections.
        /// </summary>
        /// <value>
        /// The sections.
        /// </value>
        public List<RegistrationSectionSummaryViewModel> Sections { get; set; }

        /// <summary>
        /// Gets or sets the term.
        /// </summary>
        /// <value>
        /// The term.
        /// </value>
        public string Term { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the year.
        /// </summary>
        /// <value>
        /// The year.
        /// </value>
        public string Year { get; set; }
    }
}