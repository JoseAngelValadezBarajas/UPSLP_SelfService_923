// --------------------------------------------------------------------
// <copyright file="SaveSectionGradeMappingsModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SaveSectionGradeMappingsModel
    /// </summary>
    public class SaveSectionGradeMappingsModel
    {
        /// <summary>
        /// Gets or sets the mapping list.
        /// </summary>
        /// <value>
        /// The mapping list.
        /// </value>
        public List<SectionGradeMapping> MappingList { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }
    }
}