// --------------------------------------------------------------------
// <copyright file="CreateStudentGradeModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Section
{
    /// <summary>
    /// CreateStudentGradeModel
    /// </summary>
    public class CreateStudentGradeModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance is midterm.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is midterm; otherwise, <c>false</c>.
        /// </value>
        public bool IsMidterm { get; set; }

        /// <summary>
        /// Gets or sets the transcript detail identifier.
        /// </summary>
        /// <value>
        /// The transcript detail identifier.
        /// </value>
        public int TranscriptDetailId { get; set; }
    }
}