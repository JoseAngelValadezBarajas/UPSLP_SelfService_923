// --------------------------------------------------------------------
// <copyright file="StudentGradesBySectionModel.cs" company="Ellucian">
//     Copyright 2021 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Grades;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// StudentGradesBySectionModel
    /// </summary>
    public class StudentGradesBySectionModel
    {
        /// <summary>
        /// Gets or sets the section approve grades.
        /// </summary>
        /// <value>
        /// The section approve grades.
        /// </value>
        public List<SectionApproveGradeModel> SectionApproveGrades { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }
    }
}