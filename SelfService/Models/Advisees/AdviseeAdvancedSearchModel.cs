// --------------------------------------------------------------------
// <copyright file="AdviseeAdvancedSearchModel.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Student;
using SelfService.Models.Pagination;

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AdviseeViewModel
    /// </summary>
    public class AdviseeAdvancedSearchModel : PaginationModel
    {
        /// <summary>
        /// Gets or sets the criteria.
        /// </summary>
        /// <value>
        /// The criteria.
        /// </value>
        public AdviseeSearchCriteria Criteria { get; set; }

        /// <summary>
        /// Gets or sets the filter.
        /// </summary>
        /// <value>
        /// The filter.
        /// </value>
        public int Filter { get; set; }

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