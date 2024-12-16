// --------------------------------------------------------------------
// <copyright file="GradeReportViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Shared;
using System.Collections.Generic;

namespace SelfService.Models.Grades
{
    /// <summary>
    /// GradeReportCourseViewModel
    /// </summary>
    public class CourseViewModel
    {
        /// <summary>
        /// Gets or sets the course comments.
        /// </summary>
        /// <value>
        /// The course comments.
        /// </value>
        public string CourseComments { get; set; }

        /// <summary>
        /// Gets or sets the credits.
        /// </summary>
        /// <value>
        /// The credits.
        /// </value>
        public string Credits { get; set; }

        /// <summary>
        /// Gets or sets the credit type desc.
        /// </summary>
        /// <value>
        /// The credit type desc.
        /// </value>
        public string CreditTypeDesc { get; set; }

        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public string EventId { get; set; }

        /// <summary>
        /// Gets or sets the event type desc.
        /// </summary>
        /// <value>
        /// The event type desc.
        /// </value>
        public string EventTypeDesc { get; set; }

        /// <summary>
        /// Gets or sets the final grade.
        /// </summary>
        /// <value>
        /// The final grade.
        /// </value>
        public string FinalGrade { get; set; }

        /// <summary>
        /// Gets or sets the final grade comments.
        /// </summary>
        /// <value>
        /// The final grade comments.
        /// </value>
        public string FinalGradeComments { get; set; }

        /// <summary>
        /// Gets the mid grade comments.
        /// </summary>
        /// <value>
        /// The mid grade comments.
        /// </value>
        public string MidGradeComments { get; set; }

        /// <summary>
        /// Gets or sets the midterm grade.
        /// </summary>
        /// <value>
        /// The midterm grade.
        /// </value>
        public string MidtermGrade { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the projected grade.
        /// </summary>
        /// <value>
        /// The projected grade.
        /// </value>
        public string ProjectedGrade { get; set; }

        /// <summary>
        /// Gets or sets the projected grade percentage.
        /// </summary>
        /// <value>
        /// The projected grade percentage.
        /// </value>
        public string ProjectedGradePercentage { get; set; }

        /// <summary>
        /// Gets or sets the quality points.
        /// </summary>
        /// <value>
        /// The quality points.
        /// </value>
        public string QualityPoints { get; set; }

        /// <summary>
        /// Gets or sets the section.
        /// </summary>
        /// <value>
        /// The section.
        /// </value>
        public string Section { get; set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }

        /// <summary>
        /// Gets or sets the session.
        /// </summary>
        /// <value>
        /// The session.
        /// </value>
        public string Session { get; set; }

        /// <summary>
        /// Gets or sets the type of the sub.
        /// </summary>
        /// <value>
        /// The type of the sub.
        /// </value>
        public string SubType { get; set; }
    }

    /// <summary>
    /// GradeReportViewModel
    /// </summary>
    public class GradeReportViewModel
    {
        /// <summary>
        /// Gets or sets the city.
        /// </summary>
        /// <value>
        /// The city.
        /// </value>
        public string City { get; set; }

        /// <summary>
        /// Gets or sets the country.
        /// </summary>
        /// <value>
        /// The country.
        /// </value>
        public string Country { get; set; }

        /// <summary>
        /// Gets or sets the house number.
        /// </summary>
        /// <value>
        /// The house number.
        /// </value>
        public string HouseNumber { get; set; }

        /// <summary>
        /// Gets the name of the institution.
        /// </summary>
        /// <value>
        /// The name of the institution.
        /// </value>
        public string InstitutionName { get; internal set; }

        /// <summary>
        /// Gets or sets the line1.
        /// </summary>
        /// <value>
        /// The line1.
        /// </value>
        public string Line1 { get; set; }

        /// <summary>
        /// Gets or sets the line2.
        /// </summary>
        /// <value>
        /// The line2.
        /// </value>
        public string Line2 { get; set; }

        /// <summary>
        /// Gets or sets the line3.
        /// </summary>
        /// <value>
        /// The line3.
        /// </value>
        public string Line3 { get; set; }

        /// <summary>
        /// Gets or sets the line4.
        /// </summary>
        /// <value>
        /// The line4.
        /// </value>
        public string Line4 { get; set; }

        /// <summary>
        /// Gets or sets the postal code.
        /// </summary>
        /// <value>
        /// The postal code.
        /// </value>
        public string PostalCode { get; set; }

        /// <summary>
        /// Gets or sets the sequences.
        /// </summary>
        /// <value>
        /// The sequences.
        /// </value>
        public List<ListOptionViewModel> Sequences { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show institution address].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show institution address]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowInstitutionAddress { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show institution name].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show institution name]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowInstitutionName { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show mid term grades].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show mid term grades]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowMidTermGrades { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show projected grades].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show projected grades]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowProjectedGrades { get; set; }

        /// <summary>
        /// Gets or sets the state province.
        /// </summary>
        /// <value>
        /// The state province.
        /// </value>
        public string StateProvince { get; set; }

        /// <summary>
        /// Gets or sets the transcript sequences.
        /// </summary>
        /// <value>
        /// The transcript sequences.
        /// </value>
        public List<TranscriptSequenceViewModel> TranscriptSequences { get; set; }
    }

    /// <summary>
    /// TranscriptSequenceSessionViewModel
    /// </summary>
    public class TranscriptSequenceSessionViewModel
    {
        /// <summary>
        /// Gets or sets the courses.
        /// </summary>
        /// <value>
        /// The courses.
        /// </value>
        public List<CourseViewModel> Courses { get; set; }

        /// <summary>
        /// Gets or sets the session desc.
        /// </summary>
        /// <value>
        /// The session desc.
        /// </value>
        public string SessionDesc { get; set; }
    }

    /// <summary>
    /// GradeReportSequenceViewModel
    /// </summary>
    public class TranscriptSequenceViewModel
    {
        /// <summary>
        /// Gets or sets the awards overall.
        /// </summary>
        /// <value>
        /// The awards overall.
        /// </value>
        public string AwardsOverall { get; set; }

        /// <summary>
        /// Gets or sets the awards term.
        /// </summary>
        /// <value>
        /// The awards term.
        /// </value>
        public string AwardsTerm { get; set; }

        /// <summary>
        /// Gets or sets the credits attempted.
        /// </summary>
        /// <value>
        /// The credits attempted.
        /// </value>
        public string CreditsAttempted { get; set; }

        /// <summary>
        /// Gets or sets the credits earned.
        /// </summary>
        /// <value>
        /// The credits earned.
        /// </value>
        public string CreditsEarned { get; set; }

        /// <summary>
        /// Gets or sets the gpa overall.
        /// </summary>
        /// <value>
        /// The gpa overall.
        /// </value>
        public string GpaOverall { get; set; }

        /// <summary>
        /// Gets or sets the gpa term.
        /// </summary>
        /// <value>
        /// The gpa term.
        /// </value>
        public string GpaTerm { get; set; }

        /// <summary>
        /// Gets or sets the sequence number.
        /// </summary>
        /// <value>
        /// The sequence number.
        /// </value>
        public string SequenceNumber { get; set; }

        /// <summary>
        /// Gets or sets the sessions.
        /// </summary>
        /// <value>
        /// The sessions.
        /// </value>
        public List<TranscriptSequenceSessionViewModel> Sessions { get; set; }
    }
}