// --------------------------------------------------------------------
// <copyright file="SectionApproveGradeModel.cs" company="Ellucian">
//     Copyright 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Grades
{
    /// <summary>
    /// SectionApproveGradeModel
    /// </summary>
    public class SectionApproveGradeModel
    {
        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public string Comments { get; set; }

        /// <summary>
        /// Gets or sets the grade.
        /// </summary>
        /// <value>
        /// The grade.
        /// </value>
        public string Grade { get; set; }

        /// <summary>
        /// Gets or sets the grade approval identifier.
        /// </summary>
        /// <value>
        /// The grade approval identifier.
        /// </value>
        public int GradeApprovalId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is midterm.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is midterm; otherwise, <c>false</c>.
        /// </value>
        public bool IsMidterm { get; set; }

        /// <summary>
        /// Gets or sets the student identifier.
        /// </summary>
        /// <value>
        /// The student identifier.
        /// </value>
        public int StudentId { get; set; }
    }
}