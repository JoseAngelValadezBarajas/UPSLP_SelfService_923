// --------------------------------------------------------------------
// <copyright file="SectionByPeriodViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionByPeriodViewModel
    /// </summary>
    public class SectionByPeriodViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [enable cart].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [enable cart]; otherwise, <c>false</c>.
        /// </value>
        public bool EnableCart { get; set; }

        /// <summary>
        /// Gets or sets the period.
        /// </summary>
        /// <value>
        /// The period.
        /// </value>
        public string Period { get; set; }

        /// <summary>
        /// Gets or sets the sections.
        /// </summary>
        /// <value>
        /// The sections.
        /// </value>
        public List<SectionViewModel> Sections { get; set; }
    }
}