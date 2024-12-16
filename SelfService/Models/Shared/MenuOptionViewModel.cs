// --------------------------------------------------------------------
// <copyright file="MenuOptionViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Shared
{
    /// <summary>
    /// MenuOptionViewModel
    /// </summary>
    public class MenuOptionViewModel
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is custom.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is custom; otherwise, <c>false</c>.
        /// </value>
        public bool IsCustom { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="MenuOptionViewModel"/> is visible.
        /// </summary>
        /// <value>
        ///   <c>true</c> if visible; otherwise, <c>false</c>.
        /// </value>
        public bool IsVisible { get; set; }

        /// <summary>
        /// Gets or sets the name format category identifier.
        /// </summary>
        /// <value>
        /// The name format category identifier.
        /// </value>
        public int? NameFormatCategoryId { get; set; }

        /// <summary>
        /// Gets or sets the options.
        /// </summary>
        /// <value>
        /// The options.
        /// </value>
        public List<MenuOptionViewModel> Options { get; set; }

        /// <summary>
        /// Gets or sets the site map identifier.
        /// </summary>
        /// <value>
        /// The site map identifier.
        /// </value>
        public int SiteMapId { get; set; }

        /// <summary>
        /// Gets or sets the text.
        /// </summary>
        /// <value>
        /// The text.
        /// </value>
        public string Text { get; set; }

        /// <summary>
        /// Gets or sets the URL.
        /// </summary>
        /// <value>
        /// The URL.
        /// </value>
        public string Url { get; set; }
    }
}