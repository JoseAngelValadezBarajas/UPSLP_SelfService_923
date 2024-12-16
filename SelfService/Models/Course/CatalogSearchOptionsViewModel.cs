// --------------------------------------------------------------------
// <copyright file="CatalogSearchOptionsViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Course
{
    /// <summary>
    /// CatalogSearchOptionsViewModel
    /// </summary>
    public class CatalogSearchOptionsViewModel
    {
        /// <summary>
        /// Gets or sets the class levels.
        /// </summary>
        /// <value>
        /// The class levels.
        /// </value>
        public List<ListOptionViewModel> ClassLevels { get; set; }

        /// <summary>
        /// Gets or sets the colleges.
        /// </summary>
        /// <value>
        /// The colleges.
        /// </value>
        public List<ListOptionViewModel> Colleges { get; set; }

        /// <summary>
        /// Gets or sets the credit types.
        /// </summary>
        /// <value>
        /// The credit types.
        /// </value>
        public List<ListOptionViewModel> CreditTypes { get; set; }

        /// <summary>
        /// Gets or sets the curriculums.
        /// </summary>
        /// <value>
        /// The curriculums.
        /// </value>
        public List<ListOptionViewModel> Curriculums { get; set; }

        /// <summary>
        /// Gets or sets the departments.
        /// </summary>
        /// <value>
        /// The departments.
        /// </value>
        public List<ListOptionViewModel> Departments { get; set; }

        /// <summary>
        /// Gets or sets the nontraditional programs.
        /// </summary>
        /// <value>
        /// The nontraditional programs.
        /// </value>
        public List<ListOptionViewModel> NontraditionalPrograms { get; set; }

        /// <summary>
        /// Gets or sets the populations.
        /// </summary>
        /// <value>
        /// The populations.
        /// </value>
        public List<ListOptionViewModel> Populations { get; set; }

        /// <summary>
        /// Gets or sets the programs.
        /// </summary>
        /// <value>
        /// The programs.
        /// </value>
        public List<ListOptionViewModel> Programs { get; set; }

        /// <summary>
        /// Gets or sets the sub types.
        /// </summary>
        /// <value>
        /// The sub types.
        /// </value>
        public List<ListOptionViewModel> SubTypes { get; set; }
    }
}