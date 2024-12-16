// --------------------------------------------------------------------
// <copyright file="SearchByCodeModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Pagination;

namespace SelfService.Models.Course
{
    /// <summary>
    /// SearchByCodeModel
    /// </summary>
    public class SearchByCodeModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the course code.
        /// </summary>
        /// <value>
        /// The course code.
        /// </value>
        public string CourseCode { get; set; }
    }
}