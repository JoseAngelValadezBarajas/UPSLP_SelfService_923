// --------------------------------------------------------------------
// <copyright file="GradeReportMainResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Grades
{
    public class ActivityGradesResources
    {
        public string LblCredits { get; set; }
        public string LblCumulativeGrade { get; set; }
        public string LblDueDateDetail { get; set; }
        public string LblEarnedPercentage { get; set; }
        public string LblFinalGrade { get; set; }
        public string LblFinalProgress { get; set; }
        public string LblGradeEntryDate { get; set; }
        public string LblHomeworkAssignments { get; set; }
        public string LblMaximumPoints { get; set; }
        public string LblMethod { get; set; }
        public string LblMidtermGrade { get; set; }
        public string LblNa { get; set; }
        public string LblNameDetail { get; set; }
        public string LblPointsEarned { get; set; }
        public string LblPotentialGrade { get; set; }
        public string LblPotentialPercentage { get; set; }
        public string LblProfessors { get; set; }
        public string LblSeparator { get; set; }
        public string LblSlash { get; set; }
        public string LblWeightedBy { get; set; }
    }

    public class GradeReportClassResources
    {
        public string FormatCreditType { get; set; }
        public string FormatProjectedGrade { get; set; }
        public string FormatSectionDetail { get; set; }
        public string FormatSectionSubType { get; set; }
        public string FormatSectionYTS { get; set; }
        public string LblAction { get; set; }
        public string LblAttempted { get; set; }
        public string LblAwards { get; set; }
        public string LblCourseComments { get; set; }
        public string LblCourseDetail { get; set; }
        public string LblCredits { get; set; }
        public string LblCreditsDetail { get; set; }
        public string LblEarned { get; set; }
        public string LblFinalGradeComments { get; set; }
        public string LblFinalGradeDetail { get; set; }
        public string LblGpa { get; set; }
        public string LblGradeReport { get; set; }
        public string LblGradesReportFor { get; set; }
        public string LblMidGradeComments { get; set; }
        public string LblMidtermGradeDetail { get; set; }
        public string LblNameDetail { get; set; }
        public string LblOf { get; set; }
        public string LblOverall { get; set; }
        public string LblOverallAward { get; set; }
        public string LblPage { get; set; }
        public string LblPeriod { get; set; }
        public string LblProjectedGradeDetail { get; set; }
        public string LblQualityPointsDetail { get; set; }
        public string LblSectionDetail { get; set; }
        public string LblSeparator { get; set; }
        public string LblSequence { get; set; }
        public string LblSequenceDrop { get; set; }
        public string LblSession { get; set; }
        public string LblSessionDetail { get; set; }
        public string LblSubtype { get; set; }
        public string LblTerm { get; set; }
        public string LblTermAward { get; set; }
        public string LblViewActivities { get; set; }
    }

    public class GradeReportMainResources
    {
        public ActivityGradesResources ActivityGrades { get; set; }
        public GradeReportClassResources GradeReport { get; set; }
        public string LblActivityGrades { get; set; }
        public string LblCoursework { get; set; }
        public string LblGradeReport { get; set; }
        public string LblNoActivityGrades { get; set; }
        public string LblNoResults { get; set; }
        public string LblOptions { get; set; }
        public string LblWeightedAssignmentTypeOff { get; set; }
        public string LblWeightedAssignmentTypeOn { get; set; }
        public string LblWeightingMethodActivity { get; set; }
        public string LblWeightingMethodEqually { get; set; }
        public string LblWeightingMethodPoints { get; set; }
        public string LblYourFinalProgress { get; set; }
        public string LblYourMidtermProgress { get; set; }
        public PrintResources Printing { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
    }
}