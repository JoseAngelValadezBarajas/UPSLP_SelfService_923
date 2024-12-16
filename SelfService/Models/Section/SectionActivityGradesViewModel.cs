// --------------------------------------------------------------------
// <copyright file="SectionActivityGradesViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Section
{
    /// <summary>
    /// ActivityGradeViewModel
    /// </summary>
    public class ActivityGradeViewModel
    {
        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the due date.
        /// </summary>
        /// <value>
        /// The due date.
        /// </value>
        public string DueDate { get; set; }

        /// <summary>
        /// Gets or sets the grade entry date.
        /// </summary>
        /// <value>
        /// The grade entry date.
        /// </value>
        public string GradeDueDate { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is extra credit.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is extra credit; otherwise, <c>false</c>.
        /// </value>
        public bool IsExtraCredit { get; set; }

        /// <summary>
        /// Gets or sets the total points.
        /// </summary>
        /// <value>
        /// The total points.
        /// </value>
        public string TotalPoints { get; set; }

        /// <summary>
        /// Gets or sets the total points value.
        /// </summary>
        /// <value>
        /// The total points value.
        /// </value>
        public decimal TotalPointsValue { get; set; }
    }

    /// <summary>
    /// SectionActivityGradesViewModel
    /// </summary>
    public class SectionActivityGradesViewModel
    {
        /// <summary>
        /// Gets or sets the activities.
        /// </summary>
        /// <value>
        /// The activities.
        /// </value>
        public List<ListOptionViewModel> Activities { get; set; }

        /// <summary>
        /// Gets or sets the activity grade.
        /// </summary>
        /// <value>
        /// The activity grade.
        /// </value>
        public ActivityGradeViewModel ActivityGrade { get; set; }

        /// <summary>
        /// Gets or sets the email settings.
        /// </summary>
        /// <value>
        /// The email settings.
        /// </value>
        public EmailSettingsViewModel EmailSettings { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [enable activity grade comments].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [enable activity grade comments]; otherwise, <c>false</c>.
        /// </value>
        public bool EnableActivityGradeComments { get; set; }

        /// <summary>
        /// Gets or sets the date today.
        /// </summary>
        /// <value>
        /// The date today.
        /// </value>
        public bool IsDateToday { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is restricted.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is restricted; otherwise, <c>false</c>.
        /// </value>
        public bool IsRestricted { get; set; }

        /// <summary>
        /// Gets or sets the student activity grade view models.
        /// </summary>
        /// <value>
        /// The student activity grade view models.
        /// </value>
        public List<StudentActivityGradeViewModel> StudentsActivityGrade { get; set; }
    }

    /// <summary>
    /// StudentActivityGradeModel
    /// </summary>
    public class StudentActivityGradeModel
    {
        /// <summary>
        /// Gets the assignment identifier.
        /// </summary>
        /// <value>
        /// The assignment identifier.
        /// </value>
        public int AssignmentId { get; set; }

        /// <summary>
        /// Gets or sets the points earned.
        /// </summary>
        /// <value>
        /// The points earned.
        /// </value>
        public decimal? EarnedPoints { get; set; }

        /// <summary>
        /// Gets or sets the grade.
        /// </summary>
        /// <value>
        /// The grade.
        /// </value>
        public string Grade { get; set; }

        /// <summary>
        /// Gets or sets the grade received.
        /// </summary>
        /// <value>
        /// The grade received.
        /// </value>
        public string GradeReceived { get; set; }

        /// <summary>
        /// Gets or sets the instructor comments.
        /// </summary>
        /// <value>
        /// The instructor comments.
        /// </value>
        public string InstructorComments { get; set; }

        /// <summary>
        /// Gets the student assignment identifier.
        /// </summary>
        /// <value>
        /// The student assignment identifier.
        /// </value>
        public int StudentAssignmentId { get; set; }

        /// <summary>
        /// Gets or sets the student identifier.
        /// </summary>
        /// <value>
        /// The student identifier.
        /// </value>
        public int StudentId { get; set; }
    }

    /// <summary>
    /// StudentActivityGradeViewModel
    /// </summary>
    public class StudentActivityGradeViewModel : AvatarViewModel
    {
        /// <summary>
        /// Gets the assignment identifier.
        /// </summary>
        /// <value>
        /// The assignment identifier.
        /// </value>
        public int AssignmentId { get; set; }

        /// <summary>
        /// Gets or sets the create date.
        /// </summary>
        /// <value>
        /// The create date.
        /// </value>
        public string CreateDate { get; set; }

        /// <summary>
        /// Gets or sets the points earned.
        /// </summary>
        /// <value>
        /// The points earned.
        /// </value>
        public decimal? EarnedPoints { get; set; }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the full name of the entered.
        /// </summary>
        /// <value>
        /// The full name of the entered.
        /// </value>
        public string EnteredFullName { get; set; }

        /// <summary>
        /// Gets or sets the grade.
        /// </summary>
        /// <value>
        /// The grade.
        /// </value>
        public string Grade { get; set; }

        /// <summary>
        /// Gets or sets the grade received.
        /// </summary>
        /// <value>
        /// The grade received.
        /// </value>
        public string GradeReceived { get; set; }

        /// <summary>
        /// Gets or sets the instructor comments.
        /// </summary>
        /// <value>
        /// The instructor comments.
        /// </value>
        public string InstructorComments { get; set; }

        /// <summary>
        /// Gets or sets the full name of the modified.
        /// </summary>
        /// <value>
        /// The full name of the modified.
        /// </value>
        public string ModifiedFullName { get; set; }

        /// <summary>
        /// Gets or sets the percentaje.
        /// </summary>
        /// <value>
        /// The percentaje.
        /// </value>
        public string Percentaje { get; set; }

        /// <summary>
        /// Gets or sets the possible points.
        /// </summary>
        /// <value>
        /// The possible points.
        /// </value>
        public string PossiblePoints { get; set; }

        /// <summary>
        /// Gets or sets the revision date.
        /// </summary>
        /// <value>
        /// The revision date.
        /// </value>
        public string RevisionDate { get; set; }

        /// <summary>
        /// Gets the student assignment identifier.
        /// </summary>
        /// <value>
        /// The student assignment identifier.
        /// </value>
        public int StudentAssignmentId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [witd drawn].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [witd drawn]; otherwise, <c>false</c>.
        /// </value>
        public bool Withdrawn { get; set; }
    }
}