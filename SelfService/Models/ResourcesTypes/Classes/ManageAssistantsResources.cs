// --------------------------------------------------------------------
// <copyright file="ManageAssistantsResources.cs" company="Ellucian">
//     Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Classes
{
    public class ManageAssistantsResources
    {
        public string BtnSearch { get; set; }
        public ConfirmationDialogResources DeleteMessageConfirmation { get; set; }
        public string LblFacultyAlreadyAdded { get; set; }
        public string LblNoClaims { get; set; }
        public string LblNoDefaultRole { get; set; }
        public string LblNoResults { get; set; }
        public string LblPersonIsFaculty { get; set; }
        public ManageAssistantsTableResources ManageAssistantsTable { get; set; }
        public PeopleSearchModalResources PeopleSearchModal { get; set; }
    }

    public class ManageAssistantsTableResources
    {
        public string BtnSave { get; set; }
        public string BtnSendEmail { get; set; }
        public string FormatAdded { get; set; }
        public string FormatLastModified { get; set; }
        public string FormatSelectAssistant { get; set; }
        public string LblActivities { get; set; }
        public string LblActivityGrades { get; set; }
        public string LblAlerts { get; set; }
        public string LblAssistant { get; set; }
        public string LblClassList { get; set; }
        public string LblDailyAttendance { get; set; }
        public string LblDashboardNotes { get; set; }
        public string LblDelete { get; set; }
        public string LblGradeMappings { get; set; }
        public string LblOverallAttendance { get; set; }
        public string LblOverallGrades { get; set; }
        public string LblSubmitOverallGrades { get; set; }
        public string LblWaitlist { get; set; }
        public string LblWithdrawn { get; set; }
    }
}