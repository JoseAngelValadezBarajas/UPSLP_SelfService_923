// --------------------------------------------------------------------
// <copyright file="CourseCatalogViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Course
{
    /// <summary>
	/// Class CourseCatalogViewModel.
	/// </summary>
    public class CourseCatalogViewModel
    {
        /// <summary>
		/// Gets or sets the code.
		/// </summary>
		/// <value>The code.</value>
        public string Code { get; set; }

        /// <summary>
		/// Gets or sets the description.
		/// </summary>
		/// <value>The description.</value>
        public string Description { get; set; }

        /// <summary>
		/// Gets or sets the name.
		/// </summary>
		/// <value>The name.</value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the sub type list.
        /// </summary>
        /// <value>The sub type list.</value>
        public List<SubTypeViewModel> SubTypeList { get; set; }

        /// <summary>
        /// Gets or sets the description subtype.
        /// </summary>
        /// <value>
        /// The description subtype.
        /// </value>
        public string Subtypes { get; set; }
    }

    /// <summary>
    /// CourseCatalogViewModelList
    /// </summary>
    public class CourseCatalogViewModelList
    {
        /// <summary>
        /// Gets or sets the course catalog list.
        /// </summary>
        /// <value>
        /// The course catalog list.
        /// </value>
        public List<CourseCatalogViewModel> CourseCatalogList { get; set; }

        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int OverallCount { get; set; }
    }
}