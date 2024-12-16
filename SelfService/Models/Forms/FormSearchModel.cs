// --------------------------------------------------------------------
// <copyright file="FormSearchModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Pagination;

namespace SelfService.Models.Forms
{
    /// <summary>
    /// FormSearchModel class
    /// </summary>
    public class FormSearchModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        public int Type { get; set; }
    }
}