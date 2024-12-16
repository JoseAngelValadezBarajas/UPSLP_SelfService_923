// --------------------------------------------------------------------
// <copyright file="MyTasksMainResources.cs" company="Ellucian">
//     Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Checklist
{
    public class ChecklistTaskResources
    {
        public string BtnAdd { get; set; }
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
        public string BtnSearchResponsible { get; set; }
        public string FormatAddress { get; set; }
        public string FormatDateOutOfRange { get; set; }
        public string LblAction { get; set; }
        public string LblActionDuplicated { get; set; }
        public string LblActive { get; set; }
        public string LblAddTaskLink { get; set; }
        public string LblAssociatedTasks { get; set; }
        public string LblContact { get; set; }
        public string LblCreateTaskDefault { get; set; }
        public string LblDueDate { get; set; }
        public string LblEditAction { get; set; }
        public string LblEditOffice { get; set; }
        public string LblEnterAction { get; set; }
        public string LblEnterDueDate { get; set; }
        public string LblEnterHour { get; set; }
        public string LblEnterInstructions { get; set; }
        public string LblEnterMinute { get; set; }
        public string LblEnterNotes { get; set; }
        public string LblEnterOffice { get; set; }
        public string LblEnterPriority { get; set; }
        public string LblEnterSetDueDate { get; set; }
        public string LblEnterTime { get; set; }
        public string LblEnterValidPriority { get; set; }
        public string LblExactDate { get; set; }
        public string LblGeneralSetting { get; set; }
        public string LblHour { get; set; }
        public string LblInstructions { get; set; }
        public string LblInstructionsDescription { get; set; }
        public string LblMinute { get; set; }
        public string LblNotes { get; set; }
        public string LblNotesDescription { get; set; }
        public string LblOffice { get; set; }
        public string LblOther { get; set; }
        public string LblPreview { get; set; }
        public string LblPriority { get; set; }
        public string LblRequired { get; set; }
        public string LblResponsible { get; set; }
        public string LblResponsibleInstructions { get; set; }
        public string LblSearchResponsible { get; set; }
        public string LblSession { get; set; }
        public string LblSetDueDate { get; set; }
        public string LblTime { get; set; }
        public string LblYearTerm { get; set; }
    }

    public class MyTasksMainResources : LayoutResources
    {
        public string BtnAddTask { get; set; }
        public ChecklistTaskResources checklistTaskResources { get; set; }
        public string FormatAddress { get; set; }
        public string FormatAddressLine { get; set; }
        public string FormatAssigned { get; set; }
        public string FormatCancellationReason { get; set; }
        public string FormatCancelTitle { get; set; }
        public string FormatComplete { get; set; }
        public string FormatCompletedBy { get; set; }
        public string FormatContact { get; set; }
        public string FormatDateCompleted { get; set; }
        public string FormatDateOutOfRange { get; set; }
        public string FormatDaysDue { get; set; }
        public string FormatDaysOverdue { get; set; }
        public string FormatDueDate { get; set; }
        public string FormatEditAssociateBreadCrumbs { get; set; }
        public string FormatEditBreadCrumbs { get; set; }
        public string FormatEditTask { get; set; }
        public string FormatHoursDue { get; set; }
        public string FormatHoursOverdue { get; set; }
        public string FormatOffice { get; set; }
        public string FormatPriority { get; set; }
        public string FormatReassign { get; set; }
        public string FormatReassignTaskTo { get; set; }
        public string FormatRequiredNo { get; set; }
        public string FormatRequiredYes { get; set; }
        public string FormatResponsible { get; set; }
        public string FormatSession { get; set; }
        public string FormatShowTask { get; set; }
        public string FormatTasksNumber { get; set; }
        public string FormatTerm { get; set; }
        public string FormatWaivedReason { get; set; }
        public string FormatWaiveTitle { get; set; }
        public string FormatYear { get; set; }
        public string LblAssociatedTasks { get; set; }
        public string LblBack { get; set; }
        public string LblBreadcrumbs { get; set; }
        public string LblBreadcrumbsAssociated { get; set; }
        public string LblCancel { get; set; }
        public string LblCanceled { get; set; }
        public string LblCancellationReason { get; set; }
        public string LblChange { get; set; }
        public string LblChangeResponsible { get; set; }
        public string LblComplete { get; set; }
        public string LblCompleted { get; set; }
        public string LblCompletedBy { get; set; }
        public string LblCompletedDate { get; set; }
        public string LblCompletedDateInvalid { get; set; }
        public string LblCompletedTime { get; set; }
        public string LblConfirm { get; set; }
        public string LblContact { get; set; }
        public string LblEdit { get; set; }
        public string LblEnterCompletedDate { get; set; }
        public string LblEnterCompletedTime { get; set; }
        public string LblEnterTime { get; set; }
        public string LblErrorCanceledReason { get; set; }
        public string LblErrorWaivedReason { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblInstructions { get; set; }
        public string LblLater { get; set; }
        public string LblLaterSingular { get; set; }
        public string LblMyTasks { get; set; }
        public string LblNext { get; set; }
        public string LblNoProcessedTasks { get; set; }
        public string LblNoScheduledTasks { get; set; }
        public string LblNotes { get; set; }
        public string LblNotesLegend { get; set; }
        public string LblOverdue { get; set; }
        public string LblOverdueSingular { get; set; }
        public string LblPageTitle { get; set; }
        public string LblPreview { get; set; }
        public string LblProcessed { get; set; }
        public string LblReassign { get; set; }
        public string LblReassignLegend { get; set; }
        public string LblSave { get; set; }
        public string LblSearchPerson { get; set; }
        public string LblToday { get; set; }
        public string LblToStartWork { get; set; }
        public string LblUpcoming { get; set; }
        public string LblUpcomingSingular { get; set; }
        public string LblViewProcessed { get; set; }
        public string LblWaive { get; set; }
        public string LblWaived { get; set; }
        public string LblWaivedReason { get; set; }
    }
}