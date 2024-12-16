// --------------------------------------------------------------------
// <copyright file="InstitutionSettingFilterModel.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Administration.Profile
{
    /// <summary>
    /// InstitutionSettingFilterModel
    /// </summary>
    public class InstitutionSettingFilterModel
    {
        /// <summary>
        /// Gets or sets the adds.
        /// </summary>
        /// <value>
        /// The adds.
        /// </value>
        public List<string> Adds { get; set; }

        /// <summary>
        /// Gets or sets the filter.
        /// </summary>
        /// <value>
        /// The filter.
        /// </value>
        public int Filter { get; set; }
    }
}