// --------------------------------------------------------------------
// <copyright file="ProfileViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Account.MyProfile
{
    /// <summary>
    /// AcademicGpaViewModel
    /// </summary>
    public class AcademicGpaViewModel
    {
        /// <summary>
        /// Gets or sets the gpa.
        /// </summary>
        /// <value>
        /// The gpa.
        /// </value>
        public string Gpa { get; set; }

        /// <summary>
        /// Gets or sets the year term.
        /// </summary>
        /// <value>
        /// The year term.
        /// </value>
        public string YearTerm { get; set; }
    }

    /// <summary>
    /// AcademicViewModel
    /// </summary>
    public class AcademicViewModel
    {
        /// <summary>
        /// Gets or sets the advisor.
        /// </summary>
        /// <value>
        /// The advisor.
        /// </value>
        public PersonViewModel Advisor { get; set; }

        /// <summary>
        /// Gets or sets the campus.
        /// </summary>
        /// <value>
        /// The campus.
        /// </value>
        public string Campus { get; set; }

        /// <summary>
        /// Gets or sets the class level.
        /// </summary>
        /// <value>
        /// The class level.
        /// </value>
        public string ClassLevel { get; set; }

        /// <summary>
        /// Gets or sets the college.
        /// </summary>
        /// <value>
        /// The college.
        /// </value>
        public string College { get; set; }

        /// <summary>
        /// Gets or sets the college attend.
        /// </summary>
        /// <value>
        /// The college attend.
        /// </value>
        public string CollegeAttend { get; set; }

        /// <summary>
        /// Gets or sets the curriculum.
        /// </summary>
        /// <value>
        /// The curriculum.
        /// </value>
        public string Curriculum { get; set; }

        /// <summary>
        /// Gets or sets the degree.
        /// </summary>
        /// <value>
        /// The degree.
        /// </value>
        public string Degree { get; set; }

        /// <summary>
        /// Gets or sets the department.
        /// </summary>
        /// <value>
        /// The department.
        /// </value>
        public string Department { get; set; }

        /// <summary>
        /// Gets or sets the expected graduation.
        /// </summary>
        /// <value>
        /// The expected graduation.
        /// </value>
        public string ExpectedGraduation { get; set; }

        /// <summary>
        /// Gets or sets the full part.
        /// </summary>
        /// <value>
        /// The full part.
        /// </value>
        public string FullPart { get; set; }

        /// <summary>
        /// Gets or sets the graduation session.
        /// </summary>
        /// <value>
        /// The graduation session.
        /// </value>
        public string GraduationSession { get; set; }

        /// <summary>
        /// Gets or sets the graduation status.
        /// </summary>
        /// <value>
        /// The graduation status.
        /// </value>
        public string GraduationStatus { get; set; }

        /// <summary>
        /// Gets or sets the graduation term.
        /// </summary>
        /// <value>
        /// The graduation term.
        /// </value>
        public string GraduationTerm { get; set; }

        /// <summary>
        /// Gets or sets the graduation year.
        /// </summary>
        /// <value>
        /// The graduation year.
        /// </value>
        public string GraduationYear { get; set; }

        /// <summary>
        /// Gets or sets the historical gpa.
        /// </summary>
        /// <value>
        /// The historical gpa.
        /// </value>
        public List<AcademicGpaViewModel> HistoricalGpa { get; set; }

        /// <summary>
        /// Gets or sets the matriculation date.
        /// </summary>
        /// <value>
        /// The matriculation date.
        /// </value>
        public string MatriculationDate { get; set; }

        /// <summary>
        /// Gets or sets the matriculation period.
        /// </summary>
        /// <value>
        /// The matriculation period.
        /// </value>
        public string MatriculationPeriod { get; set; }

        /// <summary>
        /// Gets or sets the non trad program.
        /// </summary>
        /// <value>
        /// The non trad program.
        /// </value>
        public string NonTradProgram { get; set; }

        /// <summary>
        /// Gets or sets the population.
        /// </summary>
        /// <value>
        /// The population.
        /// </value>
        public string Population { get; set; }

        /// <summary>
        /// Gets or sets the program.
        /// </summary>
        /// <value>
        /// The program.
        /// </value>
        public string Program { get; set; }

        /// <summary>
        /// Gets or sets the rating.
        /// </summary>
        /// <value>
        /// The rating.
        /// </value>
        public string Rating { get; set; }

        /// <summary>
        /// Gets or sets the term.
        /// </summary>
        /// <value>
        /// The term.
        /// </value>
        public string Term { get; set; }

        /// <summary>
        /// Gets or sets the term credit limit.
        /// </summary>
        /// <value>
        /// The term credit limit.
        /// </value>
        public string TermCreditLimit { get; set; }

        /// <summary>
        /// Gets or sets the transcript sequence.
        /// </summary>
        /// <value>
        /// The transcript sequence.
        /// </value>
        public string TranscriptSequence { get; set; }

        /// <summary>
        /// Gets or sets the year.
        /// </summary>
        /// <value>
        /// The year.
        /// </value>
        public string Year { get; set; }
    }

    /// <summary>
    /// AdvisorViewModel
    /// </summary>
    public class PersonViewModel : AvatarViewModel
    {
        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }
    }

    /// <summary>
    /// ProfileViewModel
    /// </summary>
    public class ProfileViewModel
    {
        /// <summary>
        /// Gets or sets the academic.
        /// </summary>
        /// <value>
        /// The academic.
        /// </value>
        public AcademicViewModel Academic { get; set; }

        /// <summary>
        /// Gets or sets the curriculum gpa.
        /// </summary>
        /// <value>
        /// The curriculum gpa.
        /// </value>
        public string CurriculumGpa { get; set; }

        /// <summary>
        /// Gets or sets the email settings.
        /// </summary>
        /// <value>
        /// The email settings.
        /// </value>
        public EmailSettingsViewModel EmailSettings { get; set; }

        /// <summary>
        /// Gets or sets the enrolled credits.
        /// </summary>
        /// <value>
        /// The enrolled credits.
        /// </value>
        public string EnrolledCredits { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has program picture.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has program picture; otherwise, <c>false</c>.
        /// </value>
        public bool HasProgramPicture { get; set; }

        /// <summary>
        /// Gets or sets the overall gpa.
        /// </summary>
        /// <value>
        /// The overall gpa.
        /// </value>
        public string OverallGpa { get; set; }

        /// <summary>
        /// Gets or sets the Person.
        /// </summary>
        /// <value>
        /// The person.
        /// </value>
        public PersonViewModel Person { get; set; }

        /// <summary>
        /// Gets or sets the program formal title.
        /// </summary>
        /// <value>
        /// The program formal title.
        /// </value>
        public string ProgramFormalTitle { get; set; }

        /// <summary>
        /// Gets or sets the PDC background picture.
        /// </summary>
        /// <value>
        /// The PDC background picture.
        /// </value>
        public int? ProgramId { get; set; }

        /// <summary>
        /// Gets or sets the remaining credits.
        /// </summary>
        /// <value>
        /// The remaining credits.
        /// </value>
        public string RemainingCredits { get; set; }

        /// <summary>
        /// Gets or sets the term attempted credits.
        /// </summary>
        /// <value>
        /// The term attempted credits.
        /// </value>
        public string TermAttemptedCredits { get; set; }

        /// <summary>
        /// Gets or sets the term earned credits.
        /// </summary>
        /// <value>
        /// The term earned credits.
        /// </value>
        public string TermEarnedCredits { get; set; }
    }
}