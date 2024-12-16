// --------------------------------------------------------------------
// <copyright file="AddressApprovalModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Pagination;

namespace SelfService.Models.Administration.Requests
{
    /// <summary>
    /// AddressApprovalModel class
    /// </summary>
    public class AddressApprovalModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the filter.
        /// </summary>
        /// <value>
        /// The filter.
        /// </value>
        public int Filter { get; set; }
    }
}