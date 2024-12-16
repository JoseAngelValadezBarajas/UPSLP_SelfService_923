// --------------------------------------------------------------------
// <copyright file="SearchModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using SelfService.Models.Pagination;

namespace SelfService.Models.Course
{
    /// <summary>
    /// SearchModel
    /// </summary>
    public class SearchModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the course catalog search.
        /// </summary>
        /// <value>
        /// The course catalog search.
        /// </value>
        public CourseCatalogSearch CourseCatalogSearch { get; set; }
    }
}