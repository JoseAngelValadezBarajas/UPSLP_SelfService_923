// --------------------------------------------------------------------
// <copyright file="PeriodFilterModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Periods
{
    /// <summary>
    /// PeriodFilterModel class
    /// </summary>
    public class PeriodFilterModel
    {
        /// <summary>
        /// Gets or sets the UI area identifier.
        /// </summary>
        /// <value>
        /// The UI area identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the year.
        /// </summary>
        /// <value>
        /// The year.
        /// </value>
        public string Year { get; set; }
    }
}