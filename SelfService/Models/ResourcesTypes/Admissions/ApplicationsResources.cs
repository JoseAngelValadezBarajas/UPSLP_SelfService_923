// --------------------------------------------------------------------
// <copyright file="ApplicationsResources.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Admissions
{
    public class ApplicationsResources : LayoutResources
    {
        public string LblApplications { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblNoResults { get; set; }
        public string LblPageTitle { get; set; }
        public SavedApplicationsResources SavedApplicationsResources { get; set; }
        public SubmittedApplicationsResources SubmittedApplicationsResources { get; set; }
    }

    public class SavedApplicationsResources
    {
        public string LblAcceptConfirmation { get; set; }
        public string LblCancelConfirmation { get; set; }
        public string LblCreated { get; set; }
        public string LblLastModified { get; set; }
        public string LblRemove { get; set; }
        public string lblRemoveConfirmation { get; set; }
        public string LblSavedApplications { get; set; }
        public string LblTitle { get; set; }
    }

    public class SubmittedApplicationsResources
    {
        public string FormatAdmitPeriod { get; set; }
        public string FormatDecisionDate { get; set; }
        public string FormatPeriod { get; set; }
        public string FormatProgramDegreeCurriculum { get; set; }
        public string FormatStatusDate { get; set; }
        public string LblAdmitPeriod { get; set; }
        public string LblCollege { get; set; }
        public string LblCollegeAttendance { get; set; }
        public string LblDecision { get; set; }
        public string LblPeriod { get; set; }
        public string LblReceiptDate { get; set; }
        public string LblStatus { get; set; }
        public string LblSubmittedApplications { get; set; }
    }
}