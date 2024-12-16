// --------------------------------------------------------------------
// <copyright file="SessionPeriodFilterModel.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Periods
{
    /// <summary>
    /// SessionPeriodFilteModel
    /// </summary>
    public class SessionPeriodFilterModel
    {
        /// <summary>
        /// Gets or sets the UI area identifier.
        /// </summary>
        /// <value>
        /// The UI area identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is enabled.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is enabled; otherwise, <c>false</c>.
        /// </value>
        public bool IsEnabled { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is enabled related.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is enabled related; otherwise, <c>false</c>.
        /// </value>
        public bool IsEnabledRelated { get; set; }

        /// <summary>
        /// Gets or sets the period filter identifier.
        /// </summary>
        /// <value>
        /// The period filter identifier.
        /// </value>
        public int PeriodFilterId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [related modified].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [related modified]; otherwise, <c>false</c>.
        /// </value>
        public bool RelatedModified { get; set; }
    }
}