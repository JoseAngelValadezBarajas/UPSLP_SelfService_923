// --------------------------------------------------------------------
// <copyright file="StudentScheduleResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;
using SelfService.Models.ResourcesTypes.Shared;

namespace SelfService.Models.ResourcesTypes.Registration
{
    public class ScheduleDetailResources
    {
        public string BtnCalendarView { get; set; }
        public string BtnListView { get; set; }
        public string BtnViewCart { get; set; }
        public string FormatBreadcrumbs { get; set; }
        public string FormatBreadcrumbsNoName { get; set; }
        public string FormatRegisteredCourses { get; set; }
        public string FormatRegisteredCredits { get; set; }
        public string FormatSession { get; set; }
        public string LblAdvisors { get; set; }
        public string LblContinuingEducation { get; set; }
        public string LblCoursesCart { get; set; }
        public string LblDeniedCourses { get; set; }
        public string LblEmailSchedule { get; set; }
        public string LblNoConEdCoursesRegistered { get; set; }
        public string LblNoTradCoursesRegistered { get; set; }
        public string LblOf { get; set; }
        public string LblPage { get; set; }
        public string LblPeriod { get; set; }
        public string LblRegisteredCourses { get; set; }
        public string LblRegisteredCredits { get; set; }
        public string LblScheduleTitle { get; set; }
        public string LblSession { get; set; }
        public string LblTraditionalCourses { get; set; }
        public string LblWaitlistCourses { get; set; }
        public ScheduleCalendarResources ScheduleCalendar { get; set; }
        public ScheduleItemResources ScheduleItem { get; set; }
    }

    public class ScheduleItemResources
    {
        public string FormatBuilding { get; set; }
        public string FormatCreditType { get; set; }
        public string FormatDuration { get; set; }
        public string FormatFloor { get; set; }
        public string FormatOrganization { get; set; }
        public string FormatRoom { get; set; }
        public string FormatSession { get; set; }
        public string FormatSessionSectionSubtype { get; set; }
        public string FormatStartEndTime { get; set; }
        public string FormatTitleSection { get; set; }
        public string FormatTypeDuration { get; set; }
        public string LblAdvisorAuthorizationNeeded { get; set; }
        public string LblApprovalDenied { get; set; }
        public string LblAwaitingApproval { get; set; }
        public string LblCeu { get; set; }
        public string LblCredits { get; set; }
        public string LblCreditType { get; set; }
        public string LblDropDenied { get; set; }
        public string LblDropPendingApproval { get; set; }
        public string LblDuration { get; set; }
        public string LblFees { get; set; }
        public string LblFloor { get; set; }
        public string LblInstructors { get; set; }
        public string LblMultipleInstructors { get; set; }
        public string LblMultipleMeetingTimes { get; set; }
        public string LblNoInstructor { get; set; }
        public string LblNoSchedule { get; set; }
        public string LblOnWaitlist { get; set; }
        public string LblPermissionApproved { get; set; }
        public string LblPermissionDenied { get; set; }
        public string LblPermissionRequested { get; set; }
        public string LblRegisterNow { get; set; }
        public string LblRoom { get; set; }
        public string LblSeatAvailable { get; set; }
        public string LblSeatDeadline { get; set; }
        public string LblSection { get; set; }
        public string LblSession { get; set; }
        public string LblStatus { get; set; }
        public string LblSubtype { get; set; }
        public string LblType { get; set; }
        public string LblViewAttendance { get; set; }
    }

    public class StudentScheduleResources
    {
        public string LblContinuingEducation { get; set; }
        public string LblCoursesCart { get; set; }
        public string LblNoCourses { get; set; }
        public string LblWaitlistCourses { get; set; }
        public PermissionRequestStatusResources PermissionRequestStatus { get; set; }
        public PrintResources Printing { get; set; }
        public ScheduleDetailResources ScheduleDetail { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
        public StudentCourseMessagesResources StudentCourseMessages { get; set; }
        public StudentCourseStatusResources StudentCourseStatus { get; set; }
    }
}