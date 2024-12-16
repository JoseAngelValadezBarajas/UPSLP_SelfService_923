// --------------------------------------------------------------------
// <copyright file="AdvisorApprovalResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;
using SelfService.Models.ResourcesTypes.Shared;

namespace SelfService.Models.ResourcesTypes.Advising
{
    public class AdvisorApprovalContent
    {
        public string BtnSwipeDown { get; set; }
        public string BtnSwipeUp { get; set; }
        public string FormatBlockName { get; set; }
        public string FormatCreditType { get; set; }
        public string FormatGroupName { get; set; }
        public string FormatRequestDateTime { get; set; }
        public string FormatSectionSubtype { get; set; }
        public string FormatTitleSection { get; set; }
        public string LblApprove { get; set; }
        public string LblApproveAll { get; set; }
        public string LblApproved { get; set; }
        public string LblCheckedSchedules { get; set; }
        public string LblClose { get; set; }
        public string LblComments { get; set; }
        public string LblDecision { get; set; }
        public string LblDecisionDate { get; set; }
        public string LblDenied { get; set; }
        public string LblDeny { get; set; }
        public string LblDenyAll { get; set; }
        public string LblDrop { get; set; }
        public string LblDropApproval { get; set; }
        public string LblDropRequests { get; set; }
        public string LblItem { get; set; }
        public string LblPending { get; set; }
        public string LblPendingAll { get; set; }
        public string LblPeriod { get; set; }
        public string LblReason { get; set; }
        public string LblRegistration { get; set; }
        public string LblRegistrationApproval { get; set; }
        public string LblRegistrationRequests { get; set; }
        public string LblRequestDate { get; set; }
        public string LblSave { get; set; }
        public string LblScheduleValid { get; set; }
        public string LblSection { get; set; }
        public string LblValidate { get; set; }
        public string LblValidateHeader { get; set; }
    }

    public class AdvisorApprovalResources
    {
        public AdvisorApprovalContent AdvisorApprovalContent { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblNoResults { get; set; }
        public string LblNotApprovedOrDenied { get; set; }
        public string LblPageTitle { get; set; }
        public string LblRegistrationSuccess { get; set; }
        public string BtnViewRegistrationSummary { get; set; }
        public RegistrationSummaryModalResources RegistrationSummaryModal { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
        public StudentCourseMessagesResources StudentCourseMessages { get; set; }
        public StudentCourseStatusResources StudentCourseStatus { get; set; }
        public ValidationMessagesModal ValidationMessagesModal { get; set; }
    }

    public class ValidationMessagesModal
    {
        public string LblFailed { get; set; }
        public string LblOk { get; set; }
    }
}