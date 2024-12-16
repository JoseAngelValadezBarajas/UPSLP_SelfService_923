// --------------------------------------------------------------------
// <copyright file="ClassificationViewModel.cs" company="Ellucian">
//     Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------
using System.Collections.Generic;

namespace SelfService.Models.Course
{
    /// <summary>
    /// ClassificationViewModel
    /// </summary>
    public class ClassificationViewModel
    {
        /// <summary>
        /// Gets or sets the course event list.
        /// </summary>
        /// <value>
        /// The course event list.
        /// </value>
        public List<CourseEventViewModel> CourseEventList { get; set; }

        /// <summary>
        /// Gets or sets the credit maximum.
        /// </summary>
        /// <value>
        /// The credit maximum.
        /// </value>
        public string CreditMax { get; set; }

        /// <summary>
		/// Gets or sets the credit Min.
		/// </summary>
		/// <value>
		/// The credit Min.
		/// </value>
        public string CreditMin { get; set; }

        /// <summary>
        /// Gets or sets the credits completed.
        /// </summary>
        /// <value>
        /// The credits completed.
        /// </value>
        public string CreditsCompleted { get; set; }

        /// <summary>
        /// Gets or sets the credits completed value.
        /// </summary>
        /// <value>
        /// The credits completed value.
        /// </value>
        public decimal CreditsCompletedValue { get; set; }

        /// <summary>
        /// Gets or sets the credits remaining.
        /// </summary>
        /// <value>
        /// The credits remaining.
        /// </value>
        public string CreditsRemaining { get; set; }

        /// <summary>
        /// Gets or sets the credits taken.
        /// </summary>
        /// <value>
        /// The credits taken.
        /// </value>
        public string CreditsTaken { get; set; }

        /// <summary>
		/// Gets or sets the description.
		/// </summary>
		/// <value>
		/// The description.
		/// </value>
        public string Description { get; set; }

        /// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
        public int Id { get; set; }
    }
}