// --------------------------------------------------------------------
// <copyright file="SearchModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using SelfService.Models.Pagination;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SearchModel
    /// </summary>
    public class SearchModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the section search parameters.
        /// </summary>
        /// <value>
        /// The section search parameters.
        /// </value>
        public SectionSearch SectionSearchParameters { get; set; }
    }
}