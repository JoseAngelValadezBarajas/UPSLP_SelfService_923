// --------------------------------------------------------------------
// <copyright file="CourseEventView.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Course
{
    /// <summary>
	/// Class CourseEventViewModel.
	/// </summary>
    public class CourseEventViewModel
    {
        /// <summary>
        /// Gets or sets the classification key.
        /// </summary>
        /// <value>
        /// The classification key.
        /// </value>
        public int ClassificationKey { get; set; }

        /// <summary>
        /// Gets or sets the close parens.
        /// </summary>
        /// <value>
        /// The close parens.
        /// </value>
        public string CloseParens { get; set; }

        /// <summary>
        /// Gets or sets the concurrent.
        /// </summary>
        /// <value>The concurrent.</value>
        public bool? Concurrent { get; set; }

        /// <summary>
        /// Gets or sets the credits.
        /// </summary>
        /// <value>
        /// The credits.
        /// </value>
        public string Credits { get; set; }

        /// <summary>
        /// Gets or sets the type of the event sub.
        /// </summary>
        /// <value>The type of the event sub.</value>
        public string EnrolledSeq { get; set; }

        /// <summary>
        /// Gets or sets the type of the event sub.
        /// </summary>
        /// <value>The type of the event sub.</value>
        public string EventSubType { get; set; }

        /// <summary>
        /// Gets or sets the final grade.
        /// </summary>
        /// <value>
        /// The final grade.
        /// </value>
        public string FinalGrade { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>The identifier.</value>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is complete.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is complete; otherwise, <c>false</c>.
        /// </value>
        public bool IsComplete { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is in progress.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is in progress; otherwise, <c>false</c>.
        /// </value>
        public bool IsInProgress { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is in progress.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is in progress; otherwise, <c>false</c>.
        /// </value>
        public bool IsNotInProgress { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is required.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is required; otherwise, <c>false</c>.
        /// </value>
        public bool IsRequired { get; set; }

        /// <summary>
        /// Gets or sets the logical operator.
        /// </summary>
        /// <value>
        /// The logical operator.
        /// </value>
        public string LogicalOperator { get; set; }

        /// <summary>
        /// Gets or sets the minimum grade.
        /// </summary>
        /// <value>The minimum grade.</value>
        public string MinGrade { get; set; }

        /// <summary>
        /// Gets or sets the minimum credits.
        /// </summary>
        /// <value>The minimum credits.</value>
        public string MinimumCredits { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>The name.</value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the open parens.
        /// </summary>
        /// <value>
        /// The open parens.
        /// </value>
        public string OpenParens { get; set; }

        /// <summary>
        /// Gets or sets the spaces count.
        /// </summary>
        /// <value>
        /// The spaces count.
        /// </value>
        public int SpacesCount { get; set; }

        /// <summary>
		/// Gets or sets the sub type description.
		/// </summary>
		/// <value>The sub type description.</value>
        public string SubTypeDescription { get; set; }

        /// <summary>
        /// Gets or sets the taken eventId.
        /// </summary>
        /// <value>
        /// The taken eventId.
        /// </value>
        public string TakenEventId { get; set; }

        /// <summary>
        /// Gets or sets the taken section.
        /// </summary>
        /// <value>
        /// The taken section.
        /// </value>
        public string TakenSection { get; set; }

        /// <summary>
        /// Gets or sets the taken session.
        /// </summary>
        /// <value>
        /// The taken session.
        /// </value>
        public string TakenSession { get; set; }

        /// <summary>
        /// Gets or sets the taken session.
        /// </summary>
        /// <value>
        /// The taken session.
        /// </value>
        public string TakenSubtype { get; set; }

        /// <summary>
        /// Gets or sets the taken term.
        /// </summary>
        /// <value>
        /// The taken term.
        /// </value>
        public string TakenTerm { get; set; }

        /// <summary>
        /// Gets or sets the taken year.
        /// </summary>
        /// <value>
        /// The taken year.
        /// </value>
        public string TakenYear { get; set; }
    }
}