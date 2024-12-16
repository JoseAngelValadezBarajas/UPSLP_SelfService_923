// --------------------------------------------------------------------
// <copyright file="SaveStudentGradeModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// SaveStudentGradeModel
    /// </summary>
    public class SaveStudentGradeModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance is submit.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is submit; otherwise, <c>false</c>.
        /// </value>
        public bool IsSubmit { get; set; }

        /// <summary>
        /// Gets or sets the overall grade list.
        /// </summary>
        /// <value>
        /// The overall grade list.
        /// </value>
        public List<StudentOverallGradeViewModel> OverallGradeList { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the type of the submit.
        /// </summary>
        /// <value>
        /// The type of the submit.
        /// </value>
        public int SubmitType { get; set; }
    }
}