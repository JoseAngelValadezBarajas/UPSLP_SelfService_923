// --------------------------------------------------------------------
// <copyright file="AdviseeSearchModel.cs" company="Ellucian">
//     Copyright 2020 -2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Student;

namespace SelfService.Models.Advisees
{
    /// <summary>
    /// AdviseeViewModel
    /// </summary>
    public class AdviseeSearchModel : AdviseeSearchCriteria
    {
        /// <summary>
        /// Gets or sets the filter.
        /// </summary>
        /// <value>
        /// The filter.
        /// </value>
        public int? Filter { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is advanced search.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is advanced search; otherwise, <c>false</c>.
        /// </value>
        public bool IsAdvancedSearch { get; set; }

        /// <summary>
        /// Gets or sets the keyword.
        /// </summary>
        /// <value>
        /// The keyword.
        /// </value>
        public string Keyword { get; set; }

        /// <summary>
        /// Gets or sets the length.
        /// </summary>
        /// <value>
        /// The length.
        /// </value>
        public int? Length { get; set; }

        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int? OverallCount { get; set; }

        /// <summary>
        /// Gets or sets the session period identifier.
        /// </summary>
        /// <value>
        /// The session period identifier.
        /// </value>
        public int? SessionPeriodId { get; set; }

        /// <summary>
        /// Gets or sets the start index.
        /// </summary>
        /// <value>
        /// The start index.
        /// </value>
        public int? StartIndex { get; set; }

        /// <summary>
        /// Gets or sets the view.
        /// </summary>
        /// <value>
        /// The view.
        /// </value>
        public AdviseeView? View { get; set; }
    }
}