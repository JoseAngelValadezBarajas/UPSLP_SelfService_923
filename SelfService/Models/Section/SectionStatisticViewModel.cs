// --------------------------------------------------------------------
// <copyright file="SectionStatisticViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Downloads;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SectionStatisticViewModel
    /// </summary>
    public class SectionStatisticViewModel
    {
        /// <summary>
        /// Gets or sets the average score.
        /// </summary>
        /// <value>
        /// The average score.
        /// </value>
        public string AverageScore { get; set; }

        /// <summary>
        /// Gets or sets the high score.
        /// </summary>
        /// <value>
        /// The high score.
        /// </value>
        public string HighScore { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is midterm.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is midterm; otherwise, <c>false</c>.
        /// </value>
        public bool IsMidterm { get; set; }

        /// <summary>
        /// Gets or sets the low score.
        /// </summary>
        /// <value>
        /// The low score.
        /// </value>
        public string LowScore { get; set; }

        /// <summary>
        /// Gets or sets the percent included.
        /// (SampleSize / Student Count) * 100
        /// </summary>
        /// <value>
        /// The percent included.
        /// </value>
        public string PercentIncluded { get; set; }

        /// <summary>
        /// Gets or sets the standard deviation.
        /// </summary>
        /// <value>
        /// The standard deviation.
        /// </value>
        public string StandardDeviation { get; set; }

        /// <summary>
        /// Gets or sets the variance.
        /// </summary>
        /// <value>
        /// The variance.
        /// </value>
        public string Variance { get; set; }
    }

    #region Statistics Download

    /// <summary>
    /// SectionStatisticDownloadViewModel
    /// </summary>
    public class SectionStatisticDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the average score.
        /// </summary>
        /// <value>
        /// The average score.
        /// </value>
        public string AverageScore { get; set; }

        /// <summary>
        /// Gets or sets the high score.
        /// </summary>
        /// <value>
        /// The high score.
        /// </value>
        public string HighScore { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is midterm.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is midterm; otherwise, <c>false</c>.
        /// </value>
        public bool IsMidterm { get; set; }

        /// <summary>
        /// Gets or sets the low score.
        /// </summary>
        /// <value>
        /// The low score.
        /// </value>
        public string LowScore { get; set; }

        /// <summary>
        /// Gets or sets the percent included.
        /// (SampleSize / Student Count) * 100
        /// </summary>
        /// <value>
        /// The percent included.
        /// </value>
        public string PercentIncluded { get; set; }

        /// <summary>
        /// Gets or sets the standard deviation.
        /// </summary>
        /// <value>
        /// The standard deviation.
        /// </value>
        public string StandardDeviation { get; set; }

        /// <summary>
        /// Gets or sets the variance.
        /// </summary>
        /// <value>
        /// The variance.
        /// </value>
        public string Variance { get; set; }
    }

    /// <summary>
    /// SectionStatisticsDownloadViewModel
    /// </summary>
    public class SectionStatisticsDownloadViewModel
    {
        /// <summary>
        /// Gets or sets the resources.
        /// </summary>
        /// <value>
        /// The resources.
        /// </value>
        public SectionStatisticsResources Resources { get; set; }

        /// <summary>
        /// Gets or sets the statistics.
        /// </summary>
        /// <value>
        /// The statistics.
        /// </value>
        public List<SectionStatisticDownloadViewModel> Statistic { get; set; }
    }

    #endregion Statistics Download
}