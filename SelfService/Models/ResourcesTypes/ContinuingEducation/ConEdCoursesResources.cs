// --------------------------------------------------------------------
// <copyright file="ConEdCoursesResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;
using SelfService.Models.ResourcesTypes.Registration;
using SelfService.Models.ResourcesTypes.Shared;

namespace SelfService.Models.ResourcesTypes.ContinuingEducation
{
    public class ConEdCoursesResources : LayoutResources
    {
        public AdvancedSearchModal AdvancedSearchModal { get; set; }
        public string BtnCompleteProfile { get; set; }
        public string BtnCreateAccount { get; set; }
        public string BtnReadAgreements { get; set; }
        public ConEdSectionCard ConEdSectionCard { get; set; }
        public ConEdSectionsSearch ConEdSectionsSearch { get; set; }
        public ConEdValidationMessagesModal ConEdValidationMessagesModal { get; set; }
        public CreditTypeModal CreditTypeModal { get; set; }
        public DropConEdConfirmation DropConEdConfirmation { get; set; }
        public string LblCompleteProfileMessage { get; set; }
        public string LblCompleteProfileTitle { get; set; }
        public string LblCreateAccountMessage { get; set; }
        public string LblCreateAccountTitle { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblMessageAgreement { get; set; }
        public string LblNoAcademicInfo { get; set; }
        public string LblPageTitle { get; set; }
        public string LblRegistrationSuccess { get; set; }
        public PermissionRequestModal PermissionRequestModal { get; set; }
        public PermissionRequestStatusResources PermissionRequestStatus { get; set; }
        public ScheduleList ScheduleList { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
        public StudentCourseMessagesResources StudentCourseMessages { get; set; }
        public StudentCourseStatusResources StudentCourseStatus { get; set; }
        public ValidationMessagesModal ValidationMessagesModal { get; set; }
    }

    public class ConEdSectionCard
    {
        public string BtnAdd { get; set; }
        public string BtnWait { get; set; }
        public string FormatBuilding { get; set; }
        public string FormatCeu { get; set; }
        public string FormatDuration { get; set; }
        public string FormatFloor { get; set; }
        public string FormatOrganization { get; set; }
        public string FormatRoom { get; set; }
        public string FormatSession { get; set; }
        public string FormatStartDuration { get; set; }
        public string FormatStartEndTime { get; set; }
        public string FormatSubtypeSection { get; set; }
        public string FormatAddSectionToCart { get; set; }
        public string FormatTitleSection { get; set; }
        public string FormatTruncatedDescription { get; set; }
        public string FormatTypeCreditType { get; set; }
        public string LblCeuLong { get; set; }
        public string LblFees { get; set; }
        public string LblMultipleMeetingTimes { get; set; }
        public string LblNoSchedule { get; set; }
        public string LblToWaitlist { get; set; }
    }

    public partial class ConEdSectionsSearch
    {
        public string BtnAdvancedSearch { get; set; }
        public string BtnNewSearch { get; set; }
        public string FormatResult { get; set; }
        public string FormatResults { get; set; }
        public string LblNoResults { get; set; }
        public string LblSearchTitle { get; set; }
    }

    public class ConEdValidationMessagesModal
    {
        public string BtnOk { get; set; }
        public string FormatDropValidationTitle { get; set; }
        public string FormatRegistrationValidationTitle { get; set; }
        public string LblDropFailed { get; set; }
        public string LblDropValidationReason { get; set; }
        public string LblRegistrationFailed { get; set; }
        public string LblRegistrationValidationMessage { get; set; }
        public string LblRegistrationValidationReason { get; set; }
    }

    public class DropConEdConfirmation
    {
        public string BtnAccept { get; set; }
        public string BtnDecline { get; set; }
        public string FormatTitle { get; set; }
        public string LblContent { get; set; }
    }
}