// --------------------------------------------------------------------
// <copyright file="TestScoresModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.TestScores
{
    /// <summary>
    /// TestScoresModel
    /// </summary>
    public class TestScoresModel
    {
        /// <summary>
        /// Gets or sets the component identifier.
        /// </summary>
        /// <value>
        /// The component identifier.
        /// </value>
        public string ComponentId { get; set; }

        /// <summary>
        /// Gets or sets the form identifier.
        /// </summary>
        /// <value>
        /// The form identifier.
        /// </value>
        public int FormId { get; set; }

        /// <summary>
        /// Gets or sets the group.
        /// </summary>
        /// <value>
        /// The group.
        /// </value>
        public string Group { get; set; }

        /// <summary>
        /// Gets or sets the test identifier.
        /// </summary>
        /// <value>
        /// The test identifier.
        /// </value>
        public int TestId { get; set; }
    }
}