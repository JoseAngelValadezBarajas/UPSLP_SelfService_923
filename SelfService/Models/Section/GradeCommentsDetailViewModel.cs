// --------------------------------------------------------------------
// <copyright file="GradeCommentsDetailViewModel.cs" company="Ellucian">
//     Copyright 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;

namespace SelfService.Models.Section
{
    /// <summary>
    /// GradeCommentsDetailViewModel
    /// </summary>
    public class GradeCommentsDetailViewModel
    {
        /// <summary>
        /// Gets or sets the instructor comments.
        /// </summary>
        /// <value>
        /// The instructor comments.
        /// </value>
        public string InstructorComments { get; set; }

        /// <summary>
        /// Gets or sets the entered date.
        /// </summary>
        /// <value>
        /// The entered date.
        /// </value>
        public string EnteredDate { get; set; }

        /// <summary>
        /// Gets or sets the created.
        /// </summary>
        /// <value>
        /// The created.
        /// </value>
        public string EnteredFullName { get; set; }

        /// <summary>
        /// Gets or sets the entered time.
        /// </summary>
        /// <value>
        /// The entered time.
        /// </value>
        public string EnteredTime { get; set; }

        /// <summary>
        /// Gets or sets the grade.
        /// </summary>
        /// <value>
        /// The grade.
        /// </value>
        public string Grade { get; set; }

        /// <summary>
        /// Gets or sets the type of the grade.
        /// </summary>
        /// <value>
        /// The type of the grade.
        /// </value>
        public GradeType GradeType { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is pending.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is pending; otherwise, <c>false</c>.
        /// </value>
        public bool IsPending { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is posted.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is posted; otherwise, <c>false</c>.
        /// </value>
        public bool IsPosted { get; set; }

        /// <summary>
        /// Gets or sets the modified date.
        /// </summary>
        /// <value>
        /// The modified date.
        /// </value>
        public string ModifiedDate { get; set; }

        /// <summary>
        /// Gets or sets the modified.
        /// </summary>
        /// <value>
        /// The modified.
        /// </value>
        public string ModifiedFullName { get; set; }

        /// <summary>
        /// Gets or sets the modified time.
        /// </summary>
        /// <value>
        /// The modified time.
        /// </value>
        public string ModifiedTime { get; set; }

        /// <summary>
        /// Gets or sets the student grade identifier.
        /// </summary>
        /// <value>
        /// The student grade identifier.
        /// </value>
        public int StudentGradeId { get; set; }

        /// <summary>
        /// Gets or sets the submission date.
        /// </summary>
        /// <value>
        /// The submission date.
        /// </value>
        public string SubmissionDate { get; set; }

        /// <summary>
        /// Gets or sets the submitted.
        /// </summary>
        /// <value>
        /// The submitted.
        /// </value>
        public string SubmissionFullName { get; set; }

        /// <summary>
        /// Gets or sets the submission time.
        /// </summary>
        /// <value>
        /// The submission time.
        /// </value>
        public string SubmissionTime { get; set; }

        /// <summary>
        /// Gets the transcript comments.
        /// </summary>
        /// <value>
        /// The transcript comments.
        /// </value>
        public string TranscriptComments { get; internal set; }
    }
}