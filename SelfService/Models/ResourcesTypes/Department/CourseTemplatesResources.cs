// --------------------------------------------------------------------
// <copyright file="CourseTemplatesResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Department
{
    public class AddActivitiesModal
    {
        public string BtnSave { get; set; }
        public string FormatAdd { get; set; }
        public string FormatEdit { get; set; }
        public string LblActivityType { get; set; }
        public string LblActivityTypeRequired { get; set; }
        public string LblAssigned { get; set; }
        public string LblCountsTowardFinal { get; set; }
        public string LblCountsTowardMidterm { get; set; }
        public string LblDescription { get; set; }
        public string LblDue { get; set; }
        public string LblDueValidate { get; set; }
        public string LblEqually { get; set; }
        public string LblExtraCredit { get; set; }
        public string LblFinalWeight { get; set; }
        public string LblGeneral { get; set; }
        public string LblHelperText { get; set; }
        public string LblMidtermWeight { get; set; }
        public string LblPossiblePoints { get; set; }
        public string LblPossiblePointsValidate { get; set; }
        public string LblSelectActivity { get; set; }
        public string LblSelectDate { get; set; }
        public string LblTitle { get; set; }
        public string LblTitleRequired { get; set; }
    }

    public class AssignCourses
    {
        public string BtnAssign { get; set; }
        public string BtnSearch { get; set; }
        public string FormatAssign { get; set; }
        public string FormatAssignedCourses { get; set; }
        public string FormatSelectTemplate { get; set; }
        public string FormatBreadcrumbAssign { get; set; }
        public string FormatCourseName { get; set; }
        public string FormatCourseSection { get; set; }
        public string FormatDeleteCourse { get; set; }
        public string FormatSelected { get; set; }
        public string LblAssignCourseTemplate { get; set; }
        public string LblClassLevel { get; set; }
        public string LblClearFilters { get; set; }
        public string LblCourseName { get; set; }
        public string LblDepartment { get; set; }
        public string LblDropDownEmptyText { get; set; }
        public string LblEndDate { get; set; }
        public string LblFilter { get; set; }
        public string LblHasActivities { get; set; }
        public string LblHasActivitiesCreated { get; set; }
        public string LblHasCourseTemplate { get; set; }
        public string LblHasGrades { get; set; }
        public string LblHasPostedGrades { get; set; }
        public string LblHasTemplateAssigned { get; set; }
        public string LblInstructor { get; set; }
        public string LblNoDepartment { get; set; }
        public string LblNoSections { get; set; }
        public string LblRemove { get; set; }
        public string LblSection { get; set; }
        public string LblStartDate { get; set; }
        public string LblStatus { get; set; }
        public string LblSubtype { get; set; }
        public string LblTitleConfirmationDialogCourse { get; set; }
        public string LblViewCourses { get; set; }
    }

    public class CourseTemplatesResources : LayoutResources
    {
        public AddActivitiesModal AddActivitiesModal { get; set; }
        public AssignCourses AssignCourses { get; set; }
        public string BtnBack { get; set; }
        public string BtnCancel { get; set; }
        public string BtnChange { get; set; }
        public string BtnClear { get; set; }
        public string BtnCopy { get; set; }
        public string BtnDelete { get; set; }
        public string BtnDeleteAll { get; set; }
        public string BtnEdit { get; set; }
        public string BtnFinish { get; set; }
        public string BtnNext { get; set; }
        public string BtnOk { get; set; }
        public string BtnSave { get; set; }
        public string FormatActivityTitle { get; set; }
        public string FormatBreadcrumbSetup { get; set; }
        public string FormatDeleteActivity { get; set; }
        public string FormatDeleteShared { get; set; }
        public string FormatDeleteTemplate { get; set; }
        public string FormatFinalDropsWithUnequalWeights { get; set; }
        public string FormatHasTooManyFinalDrops { get; set; }
        public string FormatItems { get; set; }
        public string FormatMidtermDropsWithUnequalWeights { get; set; }
        public string FormatOf { get; set; }
        public string FormatPercentage { get; set; }
        public string FormatPoints { get; set; }
        public string FormatSelectCourseTemplate { get; set; }
        public string FormatSelected { get; set; }
        public string FormatTitleDeleteActivity { get; set; }
        public string FormatTooManyMidtermDrops { get; set; }
        public string FormatTotalFinalPoints { get; set; }
        public string FormatTotalMidtermPoints { get; set; }
        public string LblActivities { get; set; }
        public string LblActivityWeight { get; set; }
        public string LblActivityWithExtraCredit { get; set; }
        public string LblAdd { get; set; }
        public string LblAddTemplate { get; set; }
        public string LblAssign { get; set; }
        public string LblAssigned { get; set; }
        public string LblAssignment { get; set; }
        public string LblAsterisk { get; set; }
        public string LblByActivity { get; set; }
        public string LblByActivityType { get; set; }
        public string LblByPossiblePoints { get; set; }
        public string LblCalculatedAutomatically { get; set; }
        public string LblChoseTemplate { get; set; }
        public string LblConfirm { get; set; }
        public string LblCopyActivities { get; set; }
        public string LblCountsTowardFinal { get; set; }
        public string LblCountsTowardMidterm { get; set; }
        public string LblCourse { get; set; }
        public string LblCourseTemplates { get; set; }
        public string LblCreated { get; set; }
        public string LblDeleteAllActivities { get; set; }
        public string LblDescription { get; set; }
        public string LblDropHighest { get; set; }
        public string LblDropLowest { get; set; }
        public string LblDropMessage { get; set; }
        public string LblDueDates { get; set; }
        public string LblDueDatesOp { get; set; }
        public string LblEnterForEachActivity { get; set; }
        public string LblEnterTemplateName { get; set; }
        public string LblEqually { get; set; }
        public string LblExistTemplateName { get; set; }
        public string LblExtraCredit { get; set; }
        public string LblFinal { get; set; }
        public string LblGradeMappings { get; set; }
        public string LblGradesDue { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblLegendDueDates { get; set; }
        public string LblMessageDueDates { get; set; }
        public string LblMessageNoChanges { get; set; }
        public string LblMessageShared { get; set; }
        public string LblMidterm { get; set; }
        public string LblNoActivities { get; set; }
        public string LblNoOptions { get; set; }
        public string LblNoPeriod { get; set; }
        public string LblNoTemplates { get; set; }
        public string LblOptions { get; set; }
        public string LblOverallGrades { get; set; }
        public string LblPageTitle { get; set; }
        public string LblPeriod { get; set; }
        public string LblPossiblePoints { get; set; }
        public string LblSearchPerson { get; set; }
        public string LblSelectedPerson { get; set; }
        public string LblSelectTemplate { get; set; }
        public string LblSetDueDatesBy { get; set; }
        public string LblSetDueDatesForGrades { get; set; }
        public string LblShare { get; set; }
        public string LblShared { get; set; }
        public string LblSharedStatus { get; set; }
        public string LblSharedWith { get; set; }
        public string LblShareTemplates { get; set; }
        public string LblSharing { get; set; }
        public string LblStatus { get; set; }
        public string LblTemplate { get; set; }
        public string LblTemplates { get; set; }
        public string LblTemplateSetup { get; set; }
        public string LblTheseTemplates { get; set; }
        public string LblTitle { get; set; }
        public string LblTitleConfirmationDialog { get; set; }
        public string LblTitleDeleteAll { get; set; }
        public string LblTitleDeleteShared { get; set; }
        public string LblType { get; set; }
        public string LblUseDefault { get; set; }
        public string LblView { get; set; }
        public string LblViewAssignedCourses { get; set; }
        public string LblWeight { get; set; }
        public string LblWeightActivities { get; set; }
        public string LblWeightTypeActivities { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
    }
}