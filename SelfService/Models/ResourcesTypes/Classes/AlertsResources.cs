// --------------------------------------------------------------------
// <copyright file="AlertsResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Classes
{
    public class AlertModal
    {
        public string BtnCancel { get; set; }
        public string BtnDelete { get; set; }
        public string BtnSave { get; set; }
        public string FormatDeleteAlertTitle { get; set; }
        public string LblAddAlert { get; set; }
        public string LblAlertTo { get; set; }
        public string LblAlertType { get; set; }
        public string LblConfirmationContent { get; set; }
        public string LblCreated { get; set; }
        public string LblCreatedBy { get; set; }
        public string LblDateOcurred { get; set; }
        public string LblDescription { get; set; }
        public string LblDetailtsAlert { get; set; }
        public string LblEditAlert { get; set; }
        public string LblEdited { get; set; }
        public string LblEditedBy { get; set; }
        public string LblErrorDate { get; set; }
        public string LblErrorMessage { get; set; }
    }

    public class AlertsResources
    {
        public AlertModal AlertModal { get; set; }
        public AlertsTable AlertsTable { get; set; }
        public string LblAddAlert { get; set; }
        public string LblAlertByStudent { get; set; }
        public string LblDownload { get; set; }
        public string LblEmailSelect { get; set; }
        public string LblNoResultsFound { get; set; }
    }

    public class AlertsTable
    {
        public string FormatSelectStudent { get; set; }
        public string LblAlert { get; set; }
        public string LblCategory { get; set; }
        public string LblDate { get; set; }
        public string LblName { get; set; }
        public string LblWithdrawn { get; set; }
    }
}