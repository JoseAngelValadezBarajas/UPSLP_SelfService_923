// --------------------------------------------------------------------
// <copyright file="ActivityGradeReportViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Section;
using System.Collections.Generic;

namespace SelfService.Models.Grades
{
    /// <summary>
    /// ActivityGradeReportViewModel
    /// </summary>
    public class ActivityGradeReportViewModel
    {
        /// <summary>
        /// Gets or sets the faculties.
        /// </summary>
        /// <value>
        /// The faculties.
        /// </value>
        public string Faculties { get; set; }

        /// <summary>
        /// Gets or sets the final score.
        /// </summary>
        /// <value>
        /// The final score.
        /// </value>
        public string FinalScore { get; set; }

        /// <summary>
        /// Gets or sets the finalterm assignments.
        /// </summary>
        /// <value>
        /// The finalterm assignments.
        /// </value>
        public List<StudentAssignmentTypeViewModel> FinaltermAssignments { get; set; }

        /// <summary>
        /// Gets or sets the midterm assignments.
        /// </summary>
        /// <value>
        /// The midterm assignments.
        /// </value>
        public List<StudentAssignmentTypeViewModel> MidtermAssignments { get; set; }

        /// <summary>
        /// Gets or sets the midterm score.
        /// </summary>
        /// <value>
        /// The midterm score.
        /// </value>
        public string MidtermScore { get; set; }

        /// <summary>
        /// Gets or sets the name of the section.
        /// </summary>
        /// <value>
        /// The name of the section.
        /// </value>
        public string SectionName { get; set; }
    }

    /// <summary>
    /// StudentAssignmentTypeViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Section.AssignmentTypeModel" />
    public class StudentAssignmentTypeViewModel : AssignmentTypeModel
    {
        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the student assignments.
        /// </summary>
        /// <value>
        /// The student assignments.
        /// </value>
        public List<StudentAssignmentViewModel> StudentAssignments { get; set; }
    }

    /// <summary>
    /// StudentAssignmentViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Section.AssignmentModel" />
    public class StudentAssignmentViewModel : AssignmentModel
    {
        /// <summary>
        /// Gets or sets the activity score.
        /// </summary>
        /// <value>
        /// The activity score.
        /// </value>
        public string ActivityScore { get; set; }

        /// <summary>
        /// Gets or sets the due date.
        /// </summary>
        /// <value>
        /// The due date.
        /// </value>
        public string DueDate { get; set; }

        /// <summary>
        /// Gets or sets the earned percentage.
        /// </summary>
        /// <value>
        /// The earned percentage.
        /// </value>
        public string EarnedPercentage { get; set; }

        /// <summary>
        /// Gets or sets the earned points.
        /// </summary>
        /// <value>
        /// The earned points.
        /// </value>
        public string EarnedPoints { get; set; }

        /// <summary>
        /// Gets or sets the grade entry date.
        /// </summary>
        /// <value>
        /// The grade entry date.
        /// </value>
        public string GradeEntryDate { get; set; }

        /// <summary>
        /// Gets or sets the is dropped highest.
        /// </summary>
        /// <value>The is dropped highest.</value>
        public int IsDroppedHighest { get; set; }

        /// <summary>
        /// Gets or sets the is dropped lowest.
        /// </summary>
        /// <value>The is dropped lowest.</value>
        public int IsDroppedLowest { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is earned.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is earned; otherwise, <c>false</c>.
        /// </value>
        public bool IsEarned { get; set; }

        /// <summary>
        /// Gets or sets the possible percentage.
        /// </summary>
        /// <value>
        /// The possible percentage.
        /// </value>
        public string PossiblePercentage { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }
    }
}