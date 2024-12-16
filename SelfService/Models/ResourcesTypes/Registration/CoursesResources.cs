// --------------------------------------------------------------------
// <copyright file="CoursesResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;
using SelfService.Models.ResourcesTypes.Shared;

namespace SelfService.Models.ResourcesTypes.Registration
{
    public class AdvancedSearchModal
    {
        public string BtnClear { get; set; }
        public string BtnSearch { get; set; }
        public string LblAdvancedSearch { get; set; }
        public string LblAdvancedSearchSubTitle { get; set; }
        public string LblBoth { get; set; }
        public string LblCampus { get; set; }
        public string LblClassLevel { get; set; }
        public string LblClosed { get; set; }
        public string LblCollege { get; set; }
        public string LblContinuingEducation { get; set; }
        public string LblCourse { get; set; }
        public string LblCourseDetails { get; set; }
        public string LblCourseType { get; set; }
        public string LblCreditType { get; set; }
        public string LblCurriculum { get; set; }
        public string LblDepartment { get; set; }
        public string LblDropDownEmptyText { get; set; }
        public string LblEndsBy { get; set; }
        public string LblGeneralEducation { get; set; }
        public string LblInstructor { get; set; }
        public string LblKeyword { get; set; }
        public string LblMeeting { get; set; }
        public string LblNonTraditionalPrograms { get; set; }
        public string LblOpen { get; set; }
        public string LblPeriod { get; set; }
        public string LblPopulation { get; set; }
        public string LblProgram { get; set; }
        public string LblRegistrationType { get; set; }
        public string LblSession { get; set; }
        public string LblStartsFrom { get; set; }
        public string LblStatus { get; set; }
        public string LblSubtype { get; set; }
        public string LblTimeLocation { get; set; }
        public string LblTraditionalCourses { get; set; }
        public string LblWaitlist { get; set; }
    }

    public class BlockCard
    {
        public string BtnAdd { get; set; }
        public string FormatBlockInfo { get; set; }
        public string LblCompleted { get; set; }
        public string LblCompletedTooltip { get; set; }
        public string LblProcessing { get; set; }
        public string LblProcessingTooltip { get; set; }
        public SimpleSectionCard SimpleSectionCard { get; set; }
    }

    public class BlockDetailModal
    {
        public string BtnAdd { get; set; }
        public string BtnCalendarView { get; set; }
        public string BtnDropBlock { get; set; }
        public string BtnListView { get; set; }
        public string BtnRemoveBlock { get; set; }
        public string FormatBlockInfo { get; set; }
        public string LblCompleted { get; set; }
        public string LblCompletedTooltip { get; set; }
        public string LblDeniedCourses { get; set; }
        public string LblProcessing { get; set; }
        public string LblProcessingTooltip { get; set; }
        public ScheduleCalendarResources ScheduleCalendar { get; set; }
    }

    public class CoursesResources : LayoutResources
    {
        public AdvancedSearchModal AdvancedSearchModal { get; set; }
        public BlockCard BlockCard { get; set; }
        public BlockDetailModal BlockDetailModal { get; set; }
        public string BtnAdvancedSearch { get; set; }
        public string BtnBlockSearch { get; set; }
        public string BtnNewSearch { get; set; }
        public string BtnReadAgreements { get; set; }
        public string BtnSectionSearch { get; set; }
        public string BtnViewRegistrationSummary { get; set; }
        public CreditTypeModal CreditTypeModal { get; set; }
        public DropConfirmation DropBlockConfirmation { get; set; }
        public DropConfirmation DropConfirmation { get; set; }
        public string FormatNumberOfBlock { get; set; }
        public string FormatNumberOfBlocks { get; set; }
        public string FormatResult { get; set; }
        public string FormatResults { get; set; }
        public string LblBlockRegistrationInstructions { get; set; }
        public string LblBlockRegistrationTitle { get; set; }
        public string LblCartSectionsRemoved { get; set; }
        public string LblCompleted { get; set; }
        public string LblCompletedTooltip { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblMessageAgreement { get; set; }
        public string LblNoAcademicInfo { get; set; }
        public string LblNoPeriods { get; set; }
        public string LblNoResults { get; set; }
        public string LblNoRuleGroups { get; set; }
        public string LblPageTitle { get; set; }
        public string LblProcessing { get; set; }
        public string LblProcessingTooltip { get; set; }
        public string LblRegistrationSuccess { get; set; }
        public string LblSearchTitle { get; set; }
        public PeriodLongStatus PeriodLongStatus { get; set; }
        public PeriodShortStatus PeriodShortStatus { get; set; }
        public PeriodsModal PeriodsModal { get; set; }
        public PermissionRequestModal PermissionRequestModal { get; set; }
        public PermissionRequestStatusResources PermissionRequestStatus { get; set; }
        public RegistrationSummaryModalResources RegistrationSummaryModal { get; set; }
        public ScheduleList ScheduleList { get; set; }
        public SectionCardResources SectionCard { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
        public StudentCourseMessagesResources StudentCourseMessages { get; set; }
        public StudentCourseStatusResources StudentCourseStatus { get; set; }
        public ValidationMessagesModal ValidationMessagesModal { get; set; }
        public ViewCommentsPopover ViewCommentsPopover { get; set; }
    }

    public class CreditTypeModal
    {
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
        public string FormatTitleSection { get; set; }
        public string LblCreditType { get; set; }
    }

    public class DropConfirmation
    {
        public string BtnAccept { get; set; }
        public string BtnDecline { get; set; }
        public string FormatTitle { get; set; }
        public string LblContent { get; set; }
    }

    public class PeriodsModal
    {
        public string BtnSelectPeriod { get; set; }
        public string LblPeriodModalTitle { get; set; }
        public string LblTermsNoOpen { get; set; }
        public string LblTermsNoOpenComment { get; set; }
        public string LblTermsOpen { get; set; }
        public string LblTermsOpenEmpty { get; set; }
    }

    public class PermissionRequestDetail
    {
        public string BtnAccept { get; set; }
        public string BtnCancel { get; set; }
        public string BtnEdit { get; set; }
        public string LblCommentRequired { get; set; }
        public string LblComments { get; set; }
        public string LblNoComments { get; set; }
        public string LblStatusTitle { get; set; }
        public string LblTypeComments { get; set; }
    }

    public class PermissionRequestModal
    {
        public string BtnSend { get; set; }
        public string FormatModalTitle { get; set; }
        public string LblCommentRequired { get; set; }
        public string LblComments { get; set; }
        public string LblSendTo { get; set; }
        public PermissionRequestDetail PermissionRequestDetail { get; set; }
    }

    public class ScheduleList
    {
        public string BtnCalendarView { get; set; }
        public string BtnDropBlock { get; set; }
        public string BtnListView { get; set; }
        public string BtnRegister { get; set; }
        public string BtnRemoveBlock { get; set; }
        public string BtnSwipeDown { get; set; }
        public string BtnSwipeUp { get; set; }
        public string BtnViewDetails { get; set; }
        public string FormatSectionsSelected { get; set; }
        public string LblCountCart { get; set; }
        public string LblCountPending { get; set; }
        public string LblCountRegistered { get; set; }
        public string LblDeniedCourses { get; set; }
        public string LblEmpty { get; set; }
        public string LblHideDetails { get; set; }
        public string LblScheduleTitle { get; set; }
        public string LblShowDetails { get; set; }
        public ScheduleCalendarResources ScheduleCalendar { get; set; }
        public ScheduleListItem ScheduleListItem { get; set; }
    }

    public class ScheduleListItem
    {
        public string BtnDrop { get; set; }
        public string BtnPermissionRequest { get; set; }
        public string BtnRemove { get; set; }
        public string BtnViewComments { get; set; }
        public string FormatBuilding { get; set; }
        public string FormatCreditsChangeCreditTypes { get; set; }
        public string FormatCreditsCreditTypes { get; set; }
        public string FormatDuration { get; set; }
        public string FormatFloor { get; set; }
        public string FormatInstructor { get; set; }
        public string FormatOrganization { get; set; }
        public string FormatRoom { get; set; }
        public string FormatSectionSubtype { get; set; }
        public string FormatSession { get; set; }
        public string FormatSessionSectionSubtype { get; set; }
        public string FormatStartEndTimeDays { get; set; }
        public string FormatSubtypeSection { get; set; }
        public string FormatTitleSection { get; set; }
        public string FormatTypeChangeCreditTypeCredits { get; set; }
        public string FormatTypeCreditTypeCredits { get; set; }
        public string FormatTypeDuration { get; set; }
        public string FormatYearTermSession { get; set; }
        public string LblFees { get; set; }
        public string LblMultipleInstructors { get; set; }
        public string LblMultipleMeetingTimes { get; set; }
        public string LblNoInstructor { get; set; }
        public string LblNoSchedule { get; set; }
    }

    public class SimpleSectionCard
    {
        public string FormatBuilding { get; set; }
        public string FormatCreditsSeats { get; set; }
        public string FormatFloor { get; set; }
        public string FormatOrganization { get; set; }
        public string FormatRoom { get; set; }
        public string FormatSectionInfo { get; set; }
        public string FormatStartEndTime { get; set; }
        public string LblAddToWaitlist { get; set; }
        public string LblMultipleInstructors { get; set; }
        public string LblMultipleMeetingLocations { get; set; }
        public string LblMultipleMeetingTimes { get; set; }
        public string LblNoInstructor { get; set; }
        public string LblNoScheduleLocation { get; set; }
        public string LblNoScheduleTime { get; set; }
    }

    public class ValidationMessagesModal
    {
        public string LblFailed { get; set; }
        public string LblOk { get; set; }
    }

    public class ViewCommentsPopover
    {
        public string LblNoComments { get; set; }
    }
}