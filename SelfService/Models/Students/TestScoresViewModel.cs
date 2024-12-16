// --------------------------------------------------------------------
// <copyright file="TestScoreViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Students
{
    /// <summary>
    /// TestScoreTypeViewModel
    /// </summary>
    public class TestScoreTypeViewModel
    {
        /// <summary>
        /// Gets or sets the date.
        /// </summary>
        /// <value>
        /// The date.
        /// </value>
        public string Date { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the score1.
        /// </summary>
        /// <value>
        /// The score1.
        /// </value>
        public string Score1 { get; set; }

        /// <summary>
        /// Gets or sets the score2.
        /// </summary>
        /// <value>
        /// The score2.
        /// </value>
        public string Score2 { get; set; }

        /// <summary>
        /// Gets or sets the score3.
        /// </summary>
        /// <value>
        /// The score3.
        /// </value>
        public string Score3 { get; set; }
    }

    /// <summary>
    /// TestScoreViewModel
    /// </summary>
    public class TestScoreViewModel
    {
        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is alpha.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is alpha; otherwise, <c>false</c>.
        /// </value>
        public bool IsAlpha { get; set; }

        /// <summary>
        /// Gets or sets the test scores.
        /// </summary>
        /// <value>
        /// The test scores.
        /// </value>
        public List<TestScoreTypeViewModel> TestScoreTypes { get; set; }
    }
}