// --------------------------------------------------------------------
// <copyright file="TestScoreViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Course
{
    /// <summary>
	/// Class TestScoreViewModel.
	/// </summary>
    public class TestScoreViewModel
    {
        /// <summary>
		/// Gets or sets the description.
		/// </summary>
		/// <value>The description.</value>
        public string Description { get; set; }

        /// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>The identifier.</value>
        public string Id { get; set; }

        /// <summary>
		/// Gets or sets the minimum score.
		/// </summary>
		/// <value>The minimum score.</value>
        public string MinimumScore { get; set; }

        /// <summary>
		/// Gets or sets the type.
		/// </summary>
		/// <value>The type.</value>
        public string Type { get; set; }
    }
}