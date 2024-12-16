// --------------------------------------------------------------------
// <copyright file="MenuUrlViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Resources
{
    /// <summary>
    /// MenuSiteMap
    /// </summary>
    public class MenuSiteMap
    {
        /// <summary>
        /// Gets or sets the external link.
        /// </summary>
        /// <value>
        /// The external link.
        /// </value>
        public string ExternalLink { get; set; }

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
        /// Gets or sets the parent identifier.
        /// </summary>
        /// <value>
        /// The parent identifier.
        /// </value>
        public int ParentId { get; set; }

        /// <summary>
        /// Gets or sets the site map identifier.
        /// </summary>
        /// <value>
        /// The site map identifier.
        /// </value>
        public int SiteMapId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="MenuSiteMap"/> is visible.
        /// </summary>
        /// <value>
        ///   <c>true</c> if visible; otherwise, <c>false</c>.
        /// </value>
        public bool Visible { get; set; }
    }
}