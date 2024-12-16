// --------------------------------------------------------------------
// <copyright file="NodePackageManagerViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Runtime.Serialization;

namespace SelfService.Models.Administration
{
    /// <summary>
    /// College
    /// </summary>
    [DataContract]
    public class NodePackageManagerViewModel
    {
        /// <summary>
        /// Gets or sets the dependencies.
        /// </summary>
        /// <value>
        /// The dependencies.
        /// </value>
        [DataMember(Name = "dependencies")]
        public NpmDependency Dependencies { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        [DataMember(Name = "name")]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the version.
        /// </summary>
        /// <value>
        /// The version.
        /// </value>
        [DataMember(Name = "version")]
        public string Version { get; set; }
    }

    /// <summary>
    /// NpmDependency
    /// </summary>
    [DataContract]
    public class NpmDependency
    {
        /// <summary>
        /// Gets or sets the class names.
        /// </summary>
        /// <value>
        /// The class names.
        /// </value>
        [DataMember(Name = "classnames")]
        public string ClassNames { get; set; }

        /// <summary>
        /// Gets or sets the core js.
        /// </summary>
        /// <value>
        /// The core js.
        /// </value>
        [DataMember(Name = "core-js")]
        public string CoreJs { get; set; }

        /// <summary>
        /// Gets or sets the ical generator.
        /// </summary>
        /// <value>
        /// The ical generator.
        /// </value>
        [DataMember(Name = "ical-generator")]
        public string ICalGenerator { get; set; }

        /// <summary>
        /// Gets or sets the lodash.
        /// </summary>
        /// <value>
        /// The lodash.
        /// </value>
        [DataMember(Name = "lodash")]
        public string Lodash { get; set; }

        /// <summary>
        /// Gets or sets the powercampus design system.
        /// </summary>
        /// <value>
        /// The powercampus design system.
        /// </value>
        [DataMember(Name = "@hedtech/powercampus-design-system")]
        public string PowercampusDesignSystem { get; set; }

        /// <summary>
        /// Gets or sets the react.
        /// </summary>
        /// <value>
        /// The react.
        /// </value>
        [DataMember(Name = "react")]
        public string React { get; set; }

        /// <summary>
        /// Gets or sets the react DOM.
        /// </summary>
        /// <value>
        /// The react DOM.
        /// </value>
        [DataMember(Name = "react-dom")]
        public string ReactDom { get; set; }

        /// <summary>
        /// Gets or sets the react media.
        /// </summary>
        /// <value>
        /// The react media.
        /// </value>
        [DataMember(Name = "react-media")]
        public string ReactMedia { get; set; }

        /// <summary>
        /// Gets or sets the typescript.
        /// </summary>
        /// <value>
        /// The typescript.
        /// </value>
        [DataMember(Name = "typescript")]
        public string Typescript { get; set; }

        /// <summary>
        /// Gets or sets the ungap URL search parameters.
        /// </summary>
        /// <value>
        /// The ungap URL search parameters.
        /// </value>
        [DataMember(Name = "@ungap/url-search-params")]
        public string UngapUrlSearchParams { get; set; }
    }
}