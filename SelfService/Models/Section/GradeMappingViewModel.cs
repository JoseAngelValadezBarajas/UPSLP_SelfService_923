// --------------------------------------------------------------------
// <copyright file="GradeMappingViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// GradeMappingViewModel
    /// </summary>
    public class GradeMappingViewModel
    {
        /// <summary>
        /// Gets or sets the type of the credit.
        /// </summary>
        /// <value>
        /// The type of the credit.
        /// </value>
        public string CreditType { get; set; }

        /// <summary>
        /// Gets or sets the credit type identifier.
        /// </summary>
        /// <value>
        /// The credit type identifier.
        /// </value>
        public int CreditTypeId { get; set; }

        /// <summary>
        /// Gets or sets the section list.
        /// </summary>
        /// <value>
        /// The section list.
        /// </value>
        public List<SectionGradeMappingViewModel> SectionList { get; set; }
    }

    /// <summary>
    /// SectionGradeMappingViewModel
    /// </summary>
    public class SectionGradeMappingViewModel
    {
        /// <summary>
        /// Gets or sets the credit type identifier.
        /// </summary>
        /// <value>
        /// The credit type identifier.
        /// </value>
        public int CreditTypeId { get; set; }

        /// <summary>
        /// Gets or sets the grade.
        /// </summary>
        /// <value>
        /// The grade.
        /// </value>
        public string GradeValue { get; set; }

        /// <summary>
        /// Gets or sets the grade value identifier.
        /// </summary>
        /// <value>
        /// The grade value identifier.
        /// </value>
        public int GradeValueId { get; set; }

        /// <summary>
        /// Gets or sets the mapping identifier.
        /// </summary>
        /// <value>
        /// The mapping identifier.
        /// </value>
        public int MappingId { get; set; }

        /// <summary>
        /// Gets or sets the minimum final percentage.
        /// </summary>
        /// <value>
        /// The minimum final percentage.
        /// </value>
        public decimal? MinimumFinalPercentage { get; set; }

        /// <summary>
        /// Gets or sets the minimum midterm percentage.
        /// </summary>
        /// <value>
        /// The minimum midterm percentage.
        /// </value>
        public decimal? MinimumMidtermPercentage { get; set; }

        /// <summary>
        /// Gets or sets the minimum midterm percentage current.
        /// </summary>
        /// <value>
        /// The minimum midterm percentage current.
        /// </value>
        public decimal? MinimumMidtermPercentageCurrent { get; set; }

        /// <summary>
        /// Gets or sets the rank.
        /// </summary>
        /// <value>
        /// The rank.
        /// </value>
        public string Rank { get; set; }
    }

    /// <summary>
    /// SectionMappingViewModel
    /// </summary>
    public class SectionMappingViewModel
    {
        /// <summary>
        /// Gets or sets the final point.
        /// </summary>
        /// <value>
        /// The final point.
        /// </value>
        public decimal? FinalPoint { get; set; }

        /// <summary>
        /// Gets or sets the grade mapping view model list.
        /// </summary>
        /// <value>
        /// The grade mapping view model list.
        /// </value>
        public List<GradeMappingViewModel> GradeMappingList { get; set; }

        /// <summary>
        /// Gets or sets the mid term point.
        /// </summary>
        /// <value>
        /// The mid term point.
        /// </value>
        public decimal? MidTermPoint { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show mid term].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show mid term]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowMidTerm { get; set; }
    }
}