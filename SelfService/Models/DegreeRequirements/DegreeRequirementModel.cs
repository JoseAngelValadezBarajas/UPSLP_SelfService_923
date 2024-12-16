// --------------------------------------------------------------------
// <copyright file="DegreeRequirementModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.DegreeRequirements
{
    /// <summary>
    /// DegreeRequirementModel
    /// </summary>
    public class DegreeRequirementModel
    {
        /// <summary>
        /// Gets or sets the degree.
        /// </summary>
        /// <value>
        /// The degree.
        /// </value>
        public string Degree { get; set; }

        /// <summary>
        /// Gets or sets the program.
        /// </summary>
        /// <value>
        /// The program.
        /// </value>
        public string Program { get; set; }

        /// <summary>
        /// Gets or sets the year term.
        /// </summary>
        /// <value>
        /// The year term.
        /// </value>
        public string YearTerm { get; set; }
    }
}