// --------------------------------------------------------------------
// <copyright file="CatalogCourseModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Pagination;

namespace SelfService.Models.Course
{
    /// <summary>
    /// CatalogCourseModel class
    /// </summary>
    /// <seealso cref="SelfService.Models.Pagination.PaginationModel" />
    public class CatalogCourseModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the organization identifier.
        /// </summary>
        /// <value>
        /// The organization identifier.
        /// </value>
        public int OrganizationId { get; set; }

        /// <summary>
        /// Gets or sets the transfer event.
        /// </summary>
        /// <value>
        /// The transfer event.
        /// </value>
        public string TransferEvent { get; set; }
    }
}