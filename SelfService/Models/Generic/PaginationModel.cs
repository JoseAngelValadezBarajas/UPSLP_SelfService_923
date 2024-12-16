// --------------------------------------------------------------------
// <copyright file="PaginationModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Pagination
{
    /// <summary>
    /// PaginationModel class
    /// </summary>
    public class PaginationModel
    {
        /// <summary>
        /// Gets or sets the length.
        /// </summary>
        /// <value>
        /// The length.
        /// </value>
        public int? Length { get; set; }

        /// <summary>
        /// Gets or sets the start index.
        /// </summary>
        /// <value>
        /// The start index.
        /// </value>
        public int? StartIndex { get; set; }
    }
}