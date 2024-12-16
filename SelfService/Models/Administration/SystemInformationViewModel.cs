// --------------------------------------------------------------------
// <copyright file="SystemInformationViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Administration
{
    /// <summary>
    /// Stores information about an application
    /// </summary>
    public class SystemInformationViewModel
    {
        /// <summary>
        /// Gets or sets the class names.
        /// </summary>
        /// <value>
        /// The class names.
        /// </value>
        public string ClassNames { get; set; }

        /// <summary>
        /// Gets or sets the base address.
        /// </summary>
        /// <value>
        /// The base address.
        /// </value>
        public string ConnectionPowerCampus { get; set; }

        /// <summary>
        /// Gets or sets the connection power campus authentication.
        /// </summary>
        /// <value>
        /// The connection power campus authentication.
        /// </value>
        public string ConnectionPowerCampusAuth { get; set; }

        /// <summary>
        /// Gets or sets the core js.
        /// </summary>
        /// <value>
        /// The core js.
        /// </value>
        public string CoreJs { get; set; }

        /// <summary>
        /// Gets or sets the design system.
        /// </summary>
        /// <value>
        /// The design system.
        /// </value>
        public string DesignSystem { get; set; }

        /// <summary>
        /// Gets or sets the i cal generator.
        /// </summary>
        /// <value>
        /// The i cal generator.
        /// </value>
        public string ICalGenerator { get; set; }

        /// <summary>
        /// Gets or sets the lodash.
        /// </summary>
        /// <value>
        /// The lodash.
        /// </value>
        public string Lodash { get; set; }

        /// <summary>
        /// Gets or sets the react.
        /// </summary>
        /// <value>
        /// The react.
        /// </value>
        public string React { get; set; }

        /// <summary>
        /// Gets or sets the react DOM.
        /// </summary>
        /// <value>
        /// The react DOM.
        /// </value>
        public string ReactDom { get; set; }

        /// <summary>
        /// Gets or sets the react media.
        /// </summary>
        /// <value>
        /// The react media.
        /// </value>
        public string ReactMedia { get; set; }

        /// <summary>
        /// Gets or sets the version.
        /// </summary>
        /// <value>
        /// The version.
        /// </value>
        public string SelfServiceVersion { get; set; }

        /// <summary>
        /// Gets or sets the typescript.
        /// </summary>
        /// <value>
        /// The typescript.
        /// </value>
        public string Typescript { get; set; }

        /// <summary>
        /// Gets or sets the URL parameters.
        /// </summary>
        /// <value>
        /// The URL parameters.
        /// </value>
        public string UrlParams { get; set; }
    }
}