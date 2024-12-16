// --------------------------------------------------------------------
// <copyright file="ChecklistSetupResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class ChecklistSetupResources
    {
        public string BtnSave { get; set; }
        public ChecklistTaskDefaults ChecklistTaskDefaults { get; set; }
        public ChecklistTaskResources checklistTaskResources { get; set; }
        public string FormatDateOutOfRange { get; set; }
        public string LblDateInvalid { get; set; }
        public string LblErrorStartDate { get; set; }
        public string LblErrorThresholdDays { get; set; }
        public string LblInstructionsStartDate { get; set; }
        public string LblInstructionsThreshold { get; set; }
        public string LblOptions { get; set; }
        public string LblShowSummary { get; set; }
        public string LblStartDate { get; set; }
        public string LblThresholdDays { get; set; }
    }

    public class ChecklistTaskDefaults
    {
        public string BtnAccept { get; set; }
        public string BtnAdd { get; set; }
        public string BtnDecline { get; set; }
        public string FormatDeleteConfirmation { get; set; }
        public string LblActive { get; set; }
        public string LblConfirmationDialogTitle { get; set; }
        public string LblCreated { get; set; }
        public string LblDelete { get; set; }
        public string LblInstructionsTaskDefaults { get; set; }
        public string LblName { get; set; }
        public string LblNoTaskDefaults { get; set; }
        public string LblTaskDefaults { get; set; }
    }

    public class ChecklistTaskResources
    {
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
        public string FormatDateOutOfRange { get; set; }
        public string FormatOffsetDaysRange { get; set; }
        public string LblAction { get; set; }
        public string LblActionDuplicated { get; set; }
        public string LblActive { get; set; }
        public string LblCreateTaskDefault { get; set; }
        public string LblDaysAfter { get; set; }
        public string LblDueDate { get; set; }
        public string LblDueDateInstrucctions { get; set; }
        public string LblEditAction { get; set; }
        public string LblEditOffice { get; set; }
        public string LblEnterAction { get; set; }
        public string LblEnterDueDate { get; set; }
        public string LblEnterHour { get; set; }
        public string LblEnterInstructions { get; set; }
        public string LblEnterMinute { get; set; }
        public string LblEnterNotes { get; set; }
        public string LblEnterOffice { get; set; }
        public string LblEnterOffsetDays { get; set; }
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
        public string LblOffsetDays { get; set; }
        public string LblPreview { get; set; }
        public string LblPriority { get; set; }
        public string LblRequired { get; set; }
        public string LblSession { get; set; }
        public string LblSetDueDate { get; set; }
        public string LblTime { get; set; }
        public string LblYearTerm { get; set; }
    }
}