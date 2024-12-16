// --------------------------------------------------------------------
// <copyright file="RegistrationCourseModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Registration
{
    /// <summary>
    /// RegistrationCourseModel class
    /// </summary>
    public class RegistrationCourseModel
    {
        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the year term.
        /// </summary>
        /// <value>
        /// The year term.
        /// </value>
        public string YearTerm { get; set; }
    }
}