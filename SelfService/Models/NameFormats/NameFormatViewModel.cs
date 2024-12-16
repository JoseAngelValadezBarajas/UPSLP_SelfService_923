// --------------------------------------------------------------------
// <copyright file="NameFormatsViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.NameFormats
{
    /// <summary>
	/// Name format item view model
	/// </summary>
    public class NameFormatItemViewModel
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is active; otherwise, <c>false</c>.
        /// </value>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is assigned to category.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is assigned to category; otherwise, <c>false</c>.
        /// </value>
        public bool IsAssignedToCategory { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the name part list.
        /// </summary>
        /// <value>
        /// The name part list.
        /// </value>
        public List<NamePartItemViewModel> NamePartList { get; set; }

        /// <summary>
        /// Gets or sets the preview of the name format
        /// </summary>
        /// <value>
        /// The preview.
        /// </value>
        public string Preview { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show middle name initial].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show middle name initial]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowMiddleNameInitial { get; set; }

        /// <summary>
        /// Gets or sets the sort preview.
        /// </summary>
        /// <value>
        /// The sort preview.
        /// </value>
        public string SortPreview { get; set; }
    }

    /// <summary>
    /// Name format view model
    /// </summary>
    public class NameFormatListViewModel
    {
        /// <summary>
        /// Gets or sets the name format list.
        /// </summary>
        /// <value>
        /// The name format list.
        /// </value>
        public List<NameFormatItemViewModel> NameFormatList { get; set; }

        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int OverallCount { get; set; }
    }

    /// <summary>
    /// NamePartItemViewModel
    /// </summary>
    public class NamePartItemViewModel
    {
        /// <summary>
        /// Gets or sets the display order.
        /// </summary>
        /// <value>
        /// The display order.
        /// </value>
        public int DisplayOrder { get; set; }

        /// <summary>
        /// Gets or sets the name part.
        /// </summary>
        /// <value>
        /// The name part.
        /// </value>
        public string NamePart { get; set; }

        /// <summary>
        /// Gets or sets the separator.
        /// </summary>
        /// <value>
        /// The separator.
        /// </value>
        public string Separator { get; set; }

        /// <summary>
        /// Gets or sets the sort order.
        /// </summary>
        /// <value>
        /// The sort order.
        /// </value>
        public int SortOrder { get; set; }
    }
}