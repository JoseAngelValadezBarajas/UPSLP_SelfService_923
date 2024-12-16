// --------------------------------------------------------------------
// <copyright file="StudentDegReqViewModel.cs" company="Ellucian">
//     Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Course;
using System.Collections.Generic;

namespace SelfService.Models.DegreeRequirements
{
    /// <summary>
    /// StudentDegReqViewModel
    /// </summary>
    public class StudentDegReqViewModel
    {
        /// <summary>
        /// Gets or sets the courses maximum.
        /// </summary>
        /// <value>
        /// The courses maximum.
        /// </value>
        public int CoursesMax { get; set; }

        /// <summary>
        /// Gets or sets the courses minimum.
        /// </summary>
        /// <value>
        /// The courses minimum.
        /// </value>
        public int CoursesMin { get; set; }

        /// <summary>
        /// Gets or sets the credit minimum.
        /// </summary>
        /// <value>
        /// The credit minimum.
        /// </value>
        public string CreditMin { get; set; }

        /// <summary>
        /// Gets or sets the credits completed.
        /// </summary>
        /// <value>
        /// The credits completed.
        /// </value>
        public string CreditsCompleted { get; set; }

        /// <summary>
        /// Gets or sets the credits completed value.
        /// </summary>
        /// <value>
        /// The credits completed value.
        /// </value>
        public decimal CreditsCompletedValue { get; set; }

        /// <summary>
        /// Gets or sets the credit maximum.
        /// </summary>
        /// <value>
        /// The credit maximum.
        /// </value>
        public string CreditsMax { get; set; }

        /// <summary>
        /// Gets or sets the credit remaining.
        /// </summary>
        /// <value>
        /// The credit remaining.
        /// </value>
        public string CreditsRemaining { get; set; }

        /// <summary>
        /// Gets or sets the credits taken.
        /// </summary>
        /// <value>
        /// The credits taken.
        /// </value>
        public string CreditsTaken { get; set; }

        /// <summary>
        /// Gets or sets the curriculum code.
        /// </summary>
        /// <value>
        /// The curriculum code.
        /// </value>
        public string CurriculumCode { get; set; }

        /// <summary>
        /// Gets or sets the curriculum.
        /// </summary>
        /// <value>
        /// The curriculum.
        /// </value>
        public string CurriculumDesc { get; set; }

        /// <summary>
        /// Gets or sets the degree code.
        /// </summary>
        /// <value>
        /// The degree code.
        /// </value>
        public string DegreeCode { get; set; }

        /// <summary>
        /// Gets or sets the degree.
        /// </summary>
        /// <value>
        /// The degree.
        /// </value>
        public string DegreeDesc { get; set; }

        /// <summary>
        /// Gets or sets the degree gpa.
        /// </summary>
        /// <value>
        /// The degree gpa.
        /// </value>
        public string DegreeGpa { get; set; }

        /// <summary>
        /// Gets or sets the discipline.
        /// </summary>
        /// <value>
        /// The discipline.
        /// </value>
        public int Discipline { get; set; }

        /// <summary>
        /// Gets or sets the discipline list.
        /// </summary>
        /// <value>
        /// The discipline list.
        /// </value>
        public List<DisciplineViewModel> DisciplineList { get; set; }

        /// <summary>
        /// Gets or sets the formal title.
        /// </summary>
        /// <value>
        /// The formal title.
        /// </value>
        public string FormalTitle { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the matric term.
        /// </summary>
        /// <value>
        /// The matric term.
        /// </value>
        public string MatricTerm { get; set; }

        /// <summary>
        /// Gets or sets the matric year.
        /// </summary>
        /// <value>
        /// The matric year.
        /// </value>
        public string MatricYear { get; set; }

        /// <summary>
        /// Gets or sets the overall gpa.
        /// </summary>
        /// <value>
        /// The overall gpa.
        /// </value>
        public string OverallGpa { get; set; }

        /// <summary>
        /// Gets or sets the percentage courses.
        /// </summary>
        /// <value>
        /// The percentage courses.
        /// </value>
        public string PercentageCourses { get; set; }

        /// <summary>
        /// Gets or sets the percentage disciplines.
        /// </summary>
        /// <value>
        /// The percentage disciplines.
        /// </value>
        public string PercentageDisciplines { get; set; }

        /// <summary>
        /// Gets or sets the program code.
        /// </summary>
        /// <value>
        /// The program code.
        /// </value>
        public string ProgramCode { get; set; }

        /// <summary>
        /// Gets or sets the program.
        /// </summary>
        /// <value>
        /// The program.
        /// </value>
        public string ProgramDesc { get; set; }

        /// <summary>
        /// Gets or sets the program of study id.
        /// </summary>
        /// <value>
        /// The program of study id.
        /// </value>
        public int ProgramOfStudyId { get; set; }

        /// <summary>
        /// Gets or sets the sections not counted.
        /// </summary>
        /// <value>
        /// The sections not counted.
        /// </value>
        public List<CourseEventViewModel> SectionsNotCounted { get; set; }

        /// <summary>
        /// Gets or sets the term code.
        /// </summary>
        /// <value>
        /// The term code.
        /// </value>
        public string TermCode { get; set; }
    }
}