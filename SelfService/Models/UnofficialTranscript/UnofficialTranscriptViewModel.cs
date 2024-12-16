// --------------------------------------------------------------------
// <copyright file="UnofficialTranscriptViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.UnofficialTranscript
{
    /// <summary>
    /// Class HeaderInformationViewModel.
    /// </summary>
    public class HeaderInformationViewModel
    {
        /// <summary>
        /// Gets or sets the address line1.
        /// </summary>
        /// <value>The address line1.</value>
        public string AddressLine1 { get; set; }

        /// <summary>
        /// Gets or sets the address line2.
        /// </summary>
        /// <value>The address line2.</value>
        public string AddressLine2 { get; set; }

        /// <summary>
        /// Gets or sets the address line3.
        /// </summary>
        /// <value>The address line3.</value>
        public string AddressLine3 { get; set; }

        /// <summary>
        /// Gets or sets the address line4.
        /// </summary>
        /// <value>The address line4.</value>
        public string AddressLine4 { get; set; }

        /// <summary>
        /// Gets or sets the address line5.
        /// </summary>
        /// <value>The address line5.</value>
        public string AddressLine5 { get; set; }

        /// <summary>
        /// Gets or sets the birth date.
        /// </summary>
        /// <value>The birth date.</value>
        public string BirthDate { get; set; }

        /// <summary>
        /// Gets or sets the cum gpa.
        /// </summary>
        /// <value>The cum gpa.</value>
        public string CumGpa { get; set; }

        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>The full name.</value>
        public string FullName { get; set; }

        /// <summary>
        /// Gets or sets the government identifier.
        /// </summary>
        /// <value>The government identifier.</value>
        public string GovernmentId { get; set; }

        /// <summary>
        /// Gets or sets the honors.
        /// </summary>
        /// <value>The honors.</value>
        public string Honors { get; set; }

        /// <summary>
        /// Gets or sets the house number.
        /// </summary>
        /// <value>The house number.</value>
        public string HouseNumber { get; set; }

        /// <summary>
        /// Gets or sets the name of the org.
        /// </summary>
        /// <value>The name of the org.</value>
        public string OrgName { get; set; }

        /// <summary>
        /// Gets or sets the previous institutions.
        /// </summary>
        /// <value>The previous institutions.</value>
        public List<string> PreviousInstitutions { get; set; }

        /// <summary>
        /// Gets or sets the total credits view model.
        /// </summary>
        /// <value>The total credits view model.</value>
        public TotalCreditsViewModel TotalCredits { get; set; }

        /// <summary>
        /// Gets or sets the transcript degree.
        /// </summary>
        /// <value>The transcript degree.</value>
        public List<TranscriptDegreeViewModel> TranscriptDegree { get; set; }

        /// <summary>
        /// Gets or sets the transcript notes.
        /// </summary>
        /// <value>The transcript notes.</value>
        public List<string> TranscriptNotes { get; set; }

        /// <summary>
        /// Gets or sets the transcript year term view model list.
        /// </summary>
        /// <value>The transcript year term view model list.</value>
        public List<TranscriptYearTermViewModel> TranscriptYearTerm { get; set; }
    }

    /// <summary>
    /// Class TotalCreditsViewModel.
    /// </summary>
    public class TotalCreditsViewModel
    {
        /// <summary>
        /// Gets or sets the credits overall.
        /// </summary>
        /// <value>The credits overall.</value>
        public string CreditsOverall { get; set; }

        /// <summary>
        /// Gets or sets the credits taken.
        /// </summary>
        /// <value>The credits taken.</value>
        public string CreditsTaken { get; set; }

        /// <summary>
        /// Gets or sets the credits transfer.
        /// </summary>
        /// <value>The credits transfer.</value>
        public string CreditsTransfer { get; set; }
    }

    /// <summary>
    /// Class TranscriptCoursesViewModel.
    /// </summary>
    public class TranscriptCoursesViewModel
    {
        /// <summary>
        /// Gets or sets the alternate grade.
        /// </summary>
        /// <value>The alternate grade.</value>
        public string AlternateGrade { get; set; }

        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public string Comments { get; set; }

        /// <summary>
        /// Gets or sets the credits.
        /// </summary>
        /// <value>The credits.</value>
        public string Credits { get; set; }

        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>The event identifier.</value>
        public string EventId { get; set; }

        /// <summary>
        /// Gets or sets the name of the event.
        /// </summary>
        /// <value>The name of the event.</value>
        public string EventName { get; set; }

        /// <summary>
        /// Gets or sets the type of the event sub.
        /// </summary>
        /// <value>The type of the event sub.</value>
        public string EventSubType { get; set; }

        /// <summary>
        /// Gets or sets the final grade.
        /// </summary>
        /// <value>The final grade.</value>
        public string FinalGrade { get; set; }

        /// <summary>
        /// Gets or sets the final grade comments.
        /// </summary>
        /// <value>
        /// The final grade comments.
        /// </value>
        public string FinalGradeComments { get; set; }

        /// <summary>
        /// Gets or sets the quality points.
        /// </summary>
        /// <value>The quality points.</value>
        public string QualityPoints { get; set; }
    }

    /// <summary>
    /// Class TranscriptDegreeViewModel.
    /// </summary>
    public class TranscriptDegreeViewModel
    {
        /// <summary>
        /// Gets or sets the date granted.
        /// </summary>
        /// <value>The date granted.</value>
        public string DateGranted { get; set; }

        /// <summary>
        /// Gets or sets the degree desc.
        /// </summary>
        /// <value>The degree desc.</value>
        public string DegreeDesc { get; set; }

        /// <summary>
        /// Gets or sets the PDC desc.
        /// </summary>
        /// <value>The PDC desc.</value>
        public string PDCDesc { get; set; }
    }

    /// <summary>
    /// Class TranscriptGPAViewModel.
    /// </summary>
    public class TranscriptGPAViewModel
    {
        /// <summary>
        /// Gets or sets the attempted credits.
        /// </summary>
        /// <value>The attempted credits.</value>
        public string AttemptedCredits { get; set; }

        /// <summary>
        /// Gets or sets the class rank.
        /// </summary>
        /// <value>The class rank.</value>
        public string ClassRank { get; set; }

        /// <summary>
        /// Gets or sets the size of the class.
        /// </summary>
        /// <value>The size of the class.</value>
        public string ClassSize { get; set; }

        /// <summary>
        /// Gets or sets the earned credits.
        /// </summary>
        /// <value>The earned credits.</value>
        public string EarnedCredits { get; set; }

        /// <summary>
        /// Gets or sets the gpa.
        /// </summary>
        /// <value>The gpa.</value>
        public string Gpa { get; set; }

        /// <summary>
        /// Gets or sets the gpa credits.
        /// </summary>
        /// <value>The gpa credits.</value>
        public string GpaCredits { get; set; }

        /// <summary>
        /// Gets or sets the type of the gpa.
        /// </summary>
        /// <value>The type of the gpa.</value>
        public string GpaType { get; set; }

        /// <summary>
        /// Gets or sets the quality points.
        /// </summary>
        /// <value>The quality points.</value>
        public string QualityPoints { get; set; }

        /// <summary>
        /// Gets or sets the total credits.
        /// </summary>
        /// <value>The total credits.</value>
        public string TotalCredits { get; set; }

        /// <summary>
        /// Gets or sets the transfer credits.
        /// </summary>
        /// <value>The transfer credits.</value>
        public string TransferCredits { get; set; }
    }

    /// <summary>
    /// Class TranscriptOrganizationViewModel.
    /// </summary>
    public class TranscriptOrganizationViewModel
    {
        /// <summary>
        /// Gets or sets the name of the organization.
        /// </summary>
        /// <value>The name of the organization.</value>
        public string OrganizationName { get; set; }

        /// <summary>
        /// Gets or sets the transcript courses view model.
        /// </summary>
        /// <value>The transcript courses view model.</value>
        public List<TranscriptCoursesViewModel> TranscriptCourses { get; set; }
    }

    /// <summary>
    /// Class TranscriptTestScoreViewModel.
    /// </summary>
    public class TranscriptTestScoreViewModel
    {
        /// <summary>
        /// Gets or sets the date.
        /// </summary>
        /// <value>The date.</value>
        public string Date { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>The description.</value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the score.
        /// </summary>
        /// <value>The score.</value>
        public string Score { get; set; }

        /// <summary>
        /// Gets or sets the type description.
        /// </summary>
        /// <value>The type description.</value>
        public string TypeDescription { get; set; }
    }

    /// <summary>
    /// Class TranscriptYearTermViewModel.
    /// </summary>
    public class TranscriptYearTermViewModel
    {
        /// <summary>
        /// Gets or sets the period.
        /// </summary>
        /// <value>The period.</value>
        public string Period { get; set; }

        /// <summary>
        /// Gets or sets the transcript gpa view model.
        /// </summary>
        /// <value>The transcript gpa view model.</value>
        public List<TranscriptGPAViewModel> TranscriptGpa { get; set; }

        /// <summary>
        /// Gets or sets the transcript organization view model.
        /// </summary>
        /// <value>The transcript organization view model.</value>
        public List<TranscriptOrganizationViewModel> TranscriptOrganization { get; set; }

        /// <summary>
        /// Gets or sets the year term awards.
        /// </summary>
        /// <value>The year term awards.</value>
        public List<string> YearTermAwards { get; set; }

        /// <summary>
        /// Gets or sets the year term notes.
        /// </summary>
        /// <value>The year term notes.</value>
        public List<string> YearTermNotes { get; set; }
    }

    /// <summary>
    /// Class UnofficialTranscriptViewModel.
    /// </summary>
    public class UnofficialTranscriptViewModel
    {
        /// <summary>
        /// Gets or sets the Unofficial Transcript header information view model.
        /// </summary>
        /// <value>The header information view model.</value>
        public List<HeaderInformationViewModel> HeaderInformation { get; set; }

        /// <summary>
        /// Gets or sets the legend.
        /// </summary>
        /// <value>The legend.</value>
        public string Legend { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show alternate grade].
        /// </summary>
        /// <value><c>true</c> if [show alternate grade]; otherwise, <c>false</c>.</value>
        public bool ShowAlternateGrade { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show class information].
        /// </summary>
        /// <value><c>true</c> if [show class information]; otherwise, <c>false</c>.</value>
        public bool ShowClassInformation { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show date of birth].
        /// </summary>
        /// <value><c>true</c> if [show date of birth]; otherwise, <c>false</c>.</value>
        public bool ShowDateOfBirth { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show fice code].
        /// </summary>
        /// <value><c>true</c> if [show fice code]; otherwise, <c>false</c>.</value>
        public bool ShowFiceCode { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show government identifier].
        /// </summary>
        /// <value><c>true</c> if [show government identifier]; otherwise, <c>false</c>.</value>
        public bool ShowGovernmentId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show legend].
        /// </summary>
        /// <value><c>true</c> if [show legend]; otherwise, <c>false</c>.</value>
        public bool ShowLegend { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show totals at end].
        /// </summary>
        /// <value><c>true</c> if [show totals at end]; otherwise, <c>false</c>.</value>
        public bool ShowTotalsAtEnd { get; set; }

        /// <summary>
        /// Gets or sets the test scores.
        /// </summary>
        /// <value>The test scores.</value>
        public List<TranscriptTestScoreViewModel> TestScores { get; set; }
    }
}