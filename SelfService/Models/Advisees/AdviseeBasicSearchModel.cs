// --------------------------------------------------------------------
// <copyright file="AdviseeBasicSearchModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using SelfService.Models.Pagination;

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AdviseeViewModel
    /// </summary>
    public class AdviseeBasicSearchModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the key word.
        /// </summary>
        /// <value>
        /// The keyword.
        /// </value>
        public string Keyword { get; set; }

        /// <summary>
        /// Gets or sets the session period identifier.
        /// </summary>
        /// <value>
        /// The session period identifier.
        /// </value>
        public int? SessionPeriodId { get; set; }

        /// <summary>
        /// Gets or sets the view.
        /// </summary>
        /// <value>
        /// The view.
        /// </value>
        public AdviseeView View { get; set; }
    }
}