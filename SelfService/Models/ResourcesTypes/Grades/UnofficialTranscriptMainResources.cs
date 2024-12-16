// --------------------------------------------------------------------
// <copyright file="UnofficialTranscriptMainResources.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Grades
{
    public class UnofficialTranscriptGpaResources
    {
        public string LblAttemptedCredit { get; set; }
        public string LblClassRank { get; set; }
        public string LblClassSize { get; set; }
        public string LblEarnedCredits { get; set; }
        public string LblGpa { get; set; }
        public string LblGpaCredits { get; set; }
        public string LblOverall { get; set; }
        public string LblQualityPoints { get; set; }
        public string LblTerm { get; set; }
        public string LblTotalCredits { get; set; }
        public string LblTransferCredits { get; set; }
    }

    public class UnofficialTranscriptInfoResources
    {
        public string LblAwards { get; set; }
        public string LblCumulativeGpa { get; set; }
        public string LblDateGranted { get; set; }
        public string LblDegreeAwarded { get; set; }
        public string LblDob { get; set; }
        public string LblEndTranscript { get; set; }
        public string LblGeneralNotes { get; set; }
        public string LblHonors { get; set; }
        public string LblId { get; set; }
        public string LblLegend { get; set; }
        public string LblName { get; set; }
        public string LblNoDegreeAwardedYet { get; set; }
        public string LblOf { get; set; }
        public string LblOfficeRegistrar { get; set; }
        public string LblOverallCredits { get; set; }
        public string LblPage { get; set; }
        public string LblPreviousInstitution { get; set; }
        public string LblProgramDegreeCurriculum { get; set; }
        public string LblScore { get; set; }
        public string LblSlashCharacter { get; set; }
        public string LblTest { get; set; }
        public string LblTestDate { get; set; }
        public string LblTestScores { get; set; }
        public string LblTotalCreditsTaken { get; set; }
        public string LblTotalTransferCredits { get; set; }
        public string LblUnofficialTranscript { get; set; }
        public string LblYearTermNotes { get; set; }
        public UnofficialTranscriptGpaResources UnofficialTranscriptGpa { get; set; }
        public UnofficialTranscriptOrganizationResources UnofficialTranscriptOrganization { get; set; }
    }

    public class UnofficialTranscriptMainResources
    {
        public string LblErrorMessage { get; set; }
        public string LblNoUnofficialTransAvailable { get; set; }
        public PrintResources Printing { get; set; }
        public UnofficialTranscriptInfoResources UnofficialTranscriptInfo { get; set; }
    }

    public class UnofficialTranscriptOrganizationResources
    {
        public string LblAlternateGrade { get; set; }
        public string LblCourse { get; set; }
        public string LblCourseComments { get; set; }
        public string LblCredits { get; set; }
        public string LblFinalGradeComments { get; set; }
        public string LblGrade { get; set; }
        public string LblQualityPoints { get; set; }
        public string LblSubType { get; set; }
        public string LblTitle { get; set; }
    }
}