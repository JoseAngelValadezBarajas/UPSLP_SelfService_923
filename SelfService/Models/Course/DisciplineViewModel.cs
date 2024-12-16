// --------------------------------------------------------------------
// <copyright file="DisciplineViewModel.cs" company="Ellucian">
//     Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Course
{
    /// <summary>
    /// DisciplineViewModel
    /// </summary>
    public class DisciplineViewModel
    {
        /// <summary>
		/// Gets or sets the classification list.
		/// </summary>
		/// <value>The classification list.</value>
        public List<ClassificationViewModel> ClassificationList { get; set; }

        /// <summary>
        /// Gets or sets the credit maximum.
        /// </summary>
        /// <value>The credit maximum.</value>
        public string CreditMax { get; set; }

        /// <summary>
		/// Gets or sets the credit minimum.
		/// </summary>
		/// <value>The credit minimum.</value>
        public string CreditMin { get; set; }

        /// <summary>
        /// Gets or sets the credit maximum.
        /// </summary>
        /// <value>The credit maximum.</value>
        public string CreditsCompleted { get; set; }

        /// <summary>
        /// Gets or sets the credits completed value.
        /// </summary>
        /// <value>
        /// The credits completed value.
        /// </value>
        public decimal CreditsCompletedValue { get; set; }

        /// <summary>
        /// Gets or sets the credit remaining.
        /// </summary>
        /// <value>The credit remaining.</value>
        public string CreditsRemaining { get; set; }

        /// <summary>
        /// Gets or sets the credit taken.
        /// </summary>
        /// <value>The credit taken.</value>
        public string CreditsTaken { get; set; }

        /// <summary>
		/// Gets or sets the description.
		/// </summary>
		/// <value>The description.</value>
        public string Description { get; set; }

        /// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>The identifier.</value>
        public int Id { get; set; }

        /// <summary>
		/// Gets or sets the student degree requirement identifier.
		/// </summary>
		/// <value>
		/// The student degree requirement identifier.
		/// </value>
        public int StudentDegreeRequirementId { get; set; }
    }
}