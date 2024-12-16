// --------------------------------------------------------------------
// <copyright file="AddressZipCodeModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Pagination;

namespace SelfService.Models.Forms
{
    /// <summary>
    /// AddressZipCodeModel class
    /// </summary>
    public class AddressZipCodeModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the zip code.
        /// </summary>
        /// <value>
        /// The zip code.
        /// </value>
        public string ZipCode { get; set; }
    }
}