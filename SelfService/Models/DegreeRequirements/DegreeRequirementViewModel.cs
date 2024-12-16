// --------------------------------------------------------------------
// <copyright file="DegreeRequirementViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.DegreeRequirements
{
    /// <summary>
    ///  DegreeRequirementViewModel
    /// </summary>
    public class DegreeRequirementViewModel
    {
        /// <summary>
        /// Gets or sets the curriculum code.
        /// </summary>
        /// <value>
        /// The curriculum code.
        /// </value>
        public string CurriculumCode { get; set; }

        /// <summary>
        /// Gets or sets the curriculum description.
        /// </summary>
        /// <value>
        /// The curriculum description.
        /// </value>
        public string CurriculumDescription { get; set; }

        /// <summary>
        /// Gets or sets the degree code.
        /// </summary>
        /// <value>
        /// The degree code.
        /// </value>
        public string DegreeCode { get; set; }

        /// <summary>
        /// Gets or sets the degree description.
        /// </summary>
        /// <value>
        /// The degree description.
        /// </value>
        public string DegreeDescription { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the program code.
        /// </summary>
        /// <value>
        /// The program code.
        /// </value>
        public string ProgramCode { get; set; }

        /// <summary>
        /// Gets or sets the program description.
        /// </summary>
        /// <value>
        /// The program description.
        /// </value>
        public string ProgramDescription { get; set; }

        /// <summary>
        /// Gets or sets the term code.
        /// </summary>
        /// <value>
        /// The term code.
        /// </value>
        public string TermCode { get; set; }

        /// <summary>
        /// Gets or sets the term description.
        /// </summary>
        /// <value>
        /// The term description.
        /// </value>
        public string TermDescription { get; set; }

        /// <summary>
        /// Gets or sets the year.
        /// </summary>
        /// <value>
        /// The year.
        /// </value>
        public string Year { get; set; }
    }
}