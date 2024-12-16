// --------------------------------------------------------------------
// <copyright file="ClassListViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------
using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// ClassListViewModel
    /// </summary>
    public class ClassListViewModel
    {
        /// <summary>
        /// Gets or sets the periods.
        /// </summary>
        /// <value>
        /// The periods.
        /// </value>
        public List<ListOptionViewModel> Periods { get; set; }

        /// <summary>
        /// Gets or sets the sections.
        /// </summary>
        /// <value>
        /// The sections.
        /// </value>
        public List<SectionPeriodViewModel> Sections { get; set; }
    }

    /// <summary>
    /// SectionPeriodViewModel
    /// </summary>
    public class SectionPeriodViewModel
    {
        /// <summary>
        /// Gets or sets the event desc.
        /// </summary>
        /// <value>
        /// The event desc.
        /// </value>
        public string EventDesc { get; set; }

        /// <summary>
        /// Gets or sets the period identifier.
        /// </summary>
        /// <value>
        /// The period identifier.
        /// </value>
        public int PeriodId { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }
    }
}