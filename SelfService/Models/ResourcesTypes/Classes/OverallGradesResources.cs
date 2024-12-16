// --------------------------------------------------------------------
// <copyright file="OverallGradesResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Classes
{
    public class CourseStatisticsModal
    {
        public string FormatCourseSectionTitle { get; set; }
        public string FormatDownloadStatistics { get; set; }
        public string FormatTotalStudents { get; set; }
        public string LblAverageScore { get; set; }
        public string LblDownload { get; set; }
        public string LblDownloadFileName { get; set; }
        public string LblFinal { get; set; }
        public string LblHighScore { get; set; }
        public string LblLowScore { get; set; }
        public string LblMidTerm { get; set; }
        public string LblPercentage { get; set; }
        public string LblPercentIncluded { get; set; }
        public string LblPeriod { get; set; }
        public string LblStandardDeviation { get; set; }
        public string LblVariance { get; set; }
    }

    public class GradeCommentsModal
    {
        public string BtnApply { get; set; }
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
        public string FormatDateTimeFullname { get; set; }
        public string LblComments { get; set; }
        public string LblCommentsTitle { get; set; }
        public string LblAvailableComments { get; set; }
        public string LblCreate { get; set; }
        public string LblFinal { get; set; }
        public string LblGrade { get; set; }
        public string LblGradeSubmitted { get; set; }
        public string LblLastModified { get; set; }
        public string LblMidTerm { get; set; }
        public string LblPending { get; set; }
        public string LblPosted { get; set; }
        public string LblTranscriptComments { get; set; }
    }

    public class OverallGradesResources
    {
        public string BtnApplyFinal { get; set; }
        public string BtnApplyMidterm { get; set; }
        public string BtnApproveGrades { get; set; }
        public string BtnCancel { get; set; }
        public string BtnSubmit { get; set; }
        public string BtnSubmitFinal { get; set; }
        public string BtnSubmitMidterm { get; set; }
        public CourseStatisticsModal CourseStatisticsModal { get; set; }
        public string FormatActualGrade { get; set; }
        public string FormatDownloadGrades { get; set; }
        public string FormatSelectStudent { get; set; }
        public GradeCommentsModal GradeCommentsModal { get; set; }
        public string LblAssignedBy { get; set; }
        public string LblAssignedDate { get; set; }
        public string LblAvailableComments { get; set; }
        public string LblChangeGrade { get; set; }
        public string LblChangeGradeTitle { get; set; }
        public string LblComment { get; set; }
        public string LblComments { get; set; }
        public string LblCourseStatistics { get; set; }
        public string LblCreditType { get; set; }
        public string LblDownload { get; set; }
        public string LblDownloadActivityGrades { get; set; }
        public string LblEmailSelect { get; set; }
        public string LblFinalActualGrade { get; set; }
        public string LblFinalCalculated { get; set; }
        public string LblFinalComments { get; set; }
        public string LblFinalDetails { get; set; }
        public string LblFinalMyGrade { get; set; }
        public string LblGrade { get; set; }
        public string LblInstructorFinalGrade { get; set; }
        public string LblInstructorMidtermGrade { get; set; }
        public string LblIsApproved { get; set; }
        public string LblIsPending { get; set; }
        public string LblIsPosted { get; set; }
        public string LblLegend { get; set; }
        public string LblMidtermActualGrade { get; set; }
        public string LblMidtermCalculated { get; set; }
        public string LblMidtermComments { get; set; }
        public string LblMidtermMessage { get; set; }
        public string LblMidtermMyGrade { get; set; }
        public string LblName { get; set; }
        public string LblNoOverallGrades { get; set; }
        public string LblProjectedGrade { get; set; }
        public string LblReason { get; set; }
        public string LblReasonError { get; set; }
        public string LblRecall { get; set; }
        public string LblSave { get; set; }
        public string LblSelectAll { get; set; }
        public string LblTemplateName { get; set; }
        public string LblWithdrawn { get; set; }
    }
}