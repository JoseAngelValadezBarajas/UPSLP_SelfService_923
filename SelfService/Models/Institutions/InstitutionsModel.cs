// --------------------------------------------------------------------
// <copyright file="InstitutionsModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using SelfService.Models.Pagination;

namespace SelfService.Models.Institutions
{
    /// <summary>
    /// InstitutionsModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Pagination.PaginationModel" />
    public class InstitutionsModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the institution.
        /// </summary>
        /// <value>
        /// The institution.
        /// </value>
        public Institution Institution { get; set; }
    }
}