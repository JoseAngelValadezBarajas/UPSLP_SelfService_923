// --------------------------------------------------------------------
// <copyright file="NameFormatCategoriesViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.NameFormats
{
    /// <summary>
    /// Name format categories
    /// </summary>
    public class NameFormatCategoriesViewModel
    {
        /// <summary>
        /// Gets or sets the name format category list.
        /// </summary>
        /// <value>
        /// The name format category list.
        /// </value>
        public List<NameFormatCategoryViewModel> NameFormatCategoryList { get; set; }

        /// <summary>
        /// Gets or sets the name format list.
        /// </summary>
        /// <value>
        /// The name format list.
        /// </value>
        public List<ListOptionViewModel> NameFormatList { get; set; }
    }

    /// <summary>
    /// Name format category
    /// </summary>
    public class NameFormatCategoryViewModel
    {
        /// <summary>
		/// Gets or sets the category.
		/// </summary>
		/// <value>
		/// The category.
		/// </value>
        public string CategoryCode { get; set; }

        /// <summary>
		/// Gets or sets the name format category identifier.
		/// </summary>
		/// <value>
		/// The name format category identifier.
		/// </value>
        public int CategoryId { get; set; }

        /// <summary>
		/// Gets or sets the name of the format.
		/// </summary>
		/// <value>
		/// The name of the format.
		/// </value>
        public string NameFormatDesc { get; set; }

        /// <summary>
		/// Gets or sets the name format identifier.
		/// </summary>
		/// <value>
		/// The name format identifier.
		/// </value>
        public int NameFormatId { get; set; }
    }
}