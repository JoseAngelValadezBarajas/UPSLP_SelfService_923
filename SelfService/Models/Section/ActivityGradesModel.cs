// --------------------------------------------------------------------
// <copyright file="ActivityGradesModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// ActivityGradesModel
    /// </summary>
    public class ActivityGradesModel
    {
        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the students activity grade.
        /// </summary>
        /// <value>
        /// The students activity grade.
        /// </value>
        public List<StudentActivityGradeModel> StudentsActivityGrade { get; set; }
    }
}