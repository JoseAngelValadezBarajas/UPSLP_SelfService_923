// --------------------------------------------------------------------
// <copyright file="FacultyScheduleResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Classes
{
    public class FacultyScheduleDetail
    {
        public string BtnCalendarView { get; set; }
        public string BtnListView { get; set; }
        public FacultyScheduleItem FacultyScheduleItem { get; set; }
        public string FormatRegisteredCourses { get; set; }
        public string FormatRegisteredCredits { get; set; }
        public string FormatSession { get; set; }
        public string LblContinuingEducation { get; set; }
        public string LblDeniedCourses { get; set; }
        public string LblNoConEdCoursesRegistered { get; set; }
        public string LblNoTradCoursesRegistered { get; set; }
        public string LblPeriod { get; set; }
        public string LblTraditionalCourses { get; set; }
        public ScheduleCalendarResources ScheduleCalendar { get; set; }
    }

    public class FacultyScheduleItem
    {
        public string BtnClassList { get; set; }
        public string FormatBuilding { get; set; }
        public string FormatDuration { get; set; }
        public string FormatFloor { get; set; }
        public string FormatOrganization { get; set; }
        public string FormatRoom { get; set; }
        public string FormatSession { get; set; }
        public string FormatSessionSectionSubtype { get; set; }
        public string FormatStartEndTime { get; set; }
        public string FormatTitleSection { get; set; }
        public string FormatType { get; set; }
        public string LblDuration { get; set; }
        public string LblFloor { get; set; }
        public string LblMultipleInstructors { get; set; }
        public string LblMultipleMeetingTimes { get; set; }
        public string LblNoInstructor { get; set; }
        public string LblNoSchedule { get; set; }
        public string LblOf { get; set; }
        public string LblPage { get; set; }
        public string LblRoom { get; set; }
        public string LblSchedulePending { get; set; }
        public string LblSection { get; set; }
        public string LblSubtype { get; set; }
        public string LblType { get; set; }
    }

    public class FacultyScheduleResources : LayoutResources
    {
        public FacultyScheduleDetail FacultyScheduleDetail { get; set; }
        public string LblFacultySchedule { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblNoCourses { get; set; }
        public string LblOf { get; set; }
        public string LblPage { get; set; }
        public string LblPageTitle { get; set; }
        public PrintResources Printing { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
    }
}