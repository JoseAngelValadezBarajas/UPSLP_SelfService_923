// --------------------------------------------------------------------
// <copyright file="ManageAdviseesViewResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Advising
{
    public class AdviseesContent
    {
        public string LblAttendance { get; set; }
        public string LblGrades { get; set; }
        public string LblLowAttendance { get; set; }
        public string LblLowGrades { get; set; }
        public string LblPending { get; set; }
        public string LblSchedule { get; set; }
        public string LblScheduleRequests { get; set; }
        public string LblSharedWith { get; set; }
        public string LblStopListAlert { get; set; }
        public string LblViewProfile { get; set; }
        public string LblViolation { get; set; }
    }

    public class AdviseesTable
    {
        public AdviseesContent AdviseesContent { get; set; }
        public string BtnRemoveSelected { get; set; }
        public string FormatSelectAdvisee { get; set; }
        public string FormatResultsShowing { get; set; }
        public string LblAuthorizeRegistration { get; set; }
        public string LblDownload { get; set; }
        public string LblEmailSelected { get; set; }
        public string LblSchedule { get; set; }
        public string LblScheduleRequest { get; set; }
        public string LblShareAdvisees { get; set; }
        public string LblShared { get; set; }
        public string LblStopList { get; set; }
        public string LblWarning { get; set; }
    }

    public class ManageAdviseesViewResources : LayoutResources
    {
        public AdviseesSearchOptions AdviseesSearchOptions { get; set; }
        public AdviseesTable AdviseesTable { get; set; }
        public string LblAllStudents { get; set; }
        public string LblAllStudentsDownload { get; set; }
        public string LblAlumni { get; set; }
        public string LblAlumniDownload { get; set; }
        public string LblApprove { get; set; }
        public string LblCancel { get; set; }
        public string LblConfirmationRemove { get; set; }
        public string LblConfirmationSearch { get; set; }
        public string LblConfirmRemoveTitle { get; set; }
        public string LblConfirmTitle { get; set; }
        public string LblEmptyState { get; set; }
        public string LblFormerAdvisees { get; set; }
        public string LblFormerAdviseesDownload { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblMyAdvisees { get; set; }
        public string LblMyAdviseesDownload { get; set; }
        public string LblMyAssociations { get; set; }
        public string LblMyAssociationsDownload { get; set; }
        public string LblMyCampus { get; set; }
        public string LblMyCampusDownload { get; set; }
        public string LblMyDepartment { get; set; }
        public string LblMyDepartmentDownload { get; set; }
        public string LblMySharedAdvisees { get; set; }
        public string LblMySharedAdviseesDownload { get; set; }
        public string LblMyStudents { get; set; }
        public string LblMyStudentsDownload { get; set; }
        public string LblNoAdvisees { get; set; }
        public string LblPageTitle { get; set; }
        public string LblRemove { get; set; }
        public string LblSearch { get; set; }
        public string LblSearchInstructions { get; set; }
        public PeopleSearchAssignModalExtraResources PeopleSearchAssignModal { get; set; }
    }
}