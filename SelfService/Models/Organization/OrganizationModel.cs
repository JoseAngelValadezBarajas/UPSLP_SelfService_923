// --------------------------------------------------------------------
// <copyright file="OrganizationModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Pagination;

namespace SelfService.Models.Organization
{
    /// <summary>
    /// OrganizationModel class
    /// </summary>
    /// <seealso cref="SelfService.Models.Pagination.PaginationModel" />
    public class OrganizationModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }
    }
}