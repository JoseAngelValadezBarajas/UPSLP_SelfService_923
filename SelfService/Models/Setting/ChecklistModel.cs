// --------------------------------------------------------------------
// <copyright file="ChecklistModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Setting
{
    /// <summary>
    /// ChecklistModel class
    /// </summary>
    public class ChecklistModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [show summary dashboard].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show summary dashboard]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowSummaryDashboard { get; set; }

        /// <summary>
        /// Gets or sets the start date.
        /// </summary>
        /// <value>
        /// The start date.
        /// </value>
        public string StartDate { get; set; }

        /// <summary>
        /// Gets or sets the threshold days.
        /// </summary>
        /// <value>
        /// The threshold days.
        /// </value>
        public int ThresholdDays { get; set; }
    }
}