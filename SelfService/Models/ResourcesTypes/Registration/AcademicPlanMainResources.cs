// --------------------------------------------------------------------
// <copyright file="AcademicPlanMainResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Registration
{
    public class AcademicPlanClassification
    {
        public AcademicPlanCourses AcademicPlanCourses { get; set; }
        public string LblCompleted { get; set; }
        public string LblCredits { get; set; }
        public string LblMax { get; set; }
        public string LblMaxDot { get; set; }
        public string LblMin { get; set; }
        public string LblMinDot { get; set; }
        public string LblNoClassificationsAvailable { get; set; }
        public string LblPercentage { get; set; }
        public string LblRemaining { get; set; }
        public string LblRequiredCredits { get; set; }
        public string LblShowLess { get; set; }
        public string LblShowMore { get; set; }
    }

    public class AcademicPlanCourses
    {
        public string FormatSectionDetail { get; set; }
        public string LblAction { get; set; }
        public string LblAnd { get; set; }
        public string LblCompleted { get; set; }
        public string LblCourseDetail { get; set; }
        public string LblCredits { get; set; }
        public string LblFinalGrade { get; set; }
        public string LblInProgress { get; set; }
        public string LblMinGrade { get; set; }
        public string LblMinimumGrade { get; set; }
        public string LblNoCoursesAvailable { get; set; }
        public string LblOr { get; set; }
        public string LblRequired { get; set; }
        public string LblSequence { get; set; }
        public string LblStatus { get; set; }
        public string LblSubTypeDetail { get; set; }
        public string LblYes { get; set; }
    }

    public class AcademicPlanDisciplines
    {
        public AcademicPlanClassification AcademicPlanClassification { get; set; }
        public string LblCompleted { get; set; }
        public string LblCredits { get; set; }
        public string LblMax { get; set; }
        public string LblMin { get; set; }
        public string LblPercentage { get; set; }
        public string LblRemaining { get; set; }
        public string LblRequiredCredits { get; set; }
        public string LblShowLess { get; set; }
        public string LblShowMore { get; set; }
    }

    public class AcademicPlanExtraCourses
    {
        public string FormatSectionDetail { get; set; }
        public string LblCoursesNotAssignedAcaPlan { get; set; }
        public string LblCredits { get; set; }
        public string LblCourseCompleted { get; set; }
        public string LblCourseInProgress { get; set; }
        public string LblCourseStatus { get; set; }
        public string LblCourse { get; set; }
    }

    public class AcademicPlanHeader
    {
        public string BtnOtherPlans { get; set; }
        public string FormatName { get; set; }
        public string FormatPeriod { get; set; }
        public string FormatYearTerm { get; set; }
        public string LblAcademicPlanInstructions { get; set; }
        public string LblCompleted { get; set; }
        public string LblContactAdvisor { get; set; }
        public string LblCourse { get; set; }
        public string LblCredits { get; set; }
        public string LblDiscipline { get; set; }
        public string LblExpectedGraduationDate { get; set; }
        public string LblGpa { get; set; }
        public string LblGraduationPeriod { get; set; }
        public string LblMax { get; set; }
        public string LblMin { get; set; }
        public string LblOverall { get; set; }
        public string LblPercentage { get; set; }
        public string LblRemaining { get; set; }
        public string LblRequiredCredits { get; set; }
        public string LblShowLess { get; set; }
        public string LblShowMore { get; set; }
    }

    public class AcademicPlanMainResources
    {
        public AcademicPlanDisciplines AcademicPlanDisciplines { get; set; }
        public AcademicPlanExtraCourses AcademicPlanExtraCourses { get; set; }
        public AcademicPlanHeader AcademicPlanHeader { get; set; }
        public AvailableAcademicPlanModal AvailableAcademicPlanModal { get; set; }
        public CourseDetailModalResources CourseDetailModal { get; set; }
        public CoursePopOverResources CoursePopOver { get; set; }
        public CoursesModalResources CoursesModal { get; set; }
        public string LblAcademicPlanReport { get; set; }
        public string LblNoAcademicPlaInformation { get; set; }
        public string LblNoAcademicPlan { get; set; }
        public string LblOf { get; set; }
        public string LblPage { get; set; }
        public PrintResources Printing { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
        public SectionSearchModalResources SectionSearchModal { get; set; }
    }

    public class AvailableAcademicPlanModal
    {
        public string BtnSelectAcademicPlan { get; set; }
        public string LblModalTitle { get; set; }
    }
}