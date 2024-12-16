// --------------------------------------------------------------------
// <copyright file="CopyCoursesModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.GradeMappings
{
    /// <summary>
    /// CopyCoursesModel
    /// </summary>
    public class CopyCoursesModel
    {
        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the session period identifier.
        /// </summary>
        /// <value>
        /// The session period identifier.
        /// </value>
        public int SessionPeriodId { get; set; }
    }
}