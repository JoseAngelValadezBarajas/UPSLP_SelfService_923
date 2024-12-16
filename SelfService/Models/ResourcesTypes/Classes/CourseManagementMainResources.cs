// --------------------------------------------------------------------
// <copyright file="ClassesOptionsResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Classes
{
    public class CourseManagementMainOptions
    {
        public string LblActivitiesSetup { get; set; }
        public string LblActivityGrades { get; set; }
        public string LblActivityGradesDownload { get; set; }
        public string LblAlerts { get; set; }
        public string LblAlertsDownload { get; set; }
        public string LblAttendance { get; set; }
        public string LblAttendanceDownload { get; set; }
        public string LblClassList { get; set; }
        public string LblClassListDownload { get; set; }
        public string LblDailyAttendance { get; set; }
        public string LblDashboard { get; set; }
        public string LblGradeMappings { get; set; }
        public string LblManageAssistants { get; set; }
        public string LblOverallGrades { get; set; }
        public string LblOverallGradesDownload { get; set; }
        public string LblPermissionRequest { get; set; }
        public string LblWaitList { get; set; }
    }

    public class CourseManagementMainResources
    {
        public CourseManagementMainOptions CourseManagementMainOptions { get; set; }
        public string FormatCreditTypesCredits { get; set; }
        public string FormatSessionSectionSubtype { get; set; }
        public string FormatTitleSection { get; set; }
        public string FormatTypeDuration { get; set; }
        public string LblCourse { get; set; }
        public string LblCourseDescription { get; set; }
        public string LblCourseSidebar { get; set; }
        public string LblDepartment { get; set; }
        public string LblFilter { get; set; }
        public string LblInstructor { get; set; }
        public string LblInstructors { get; set; }
        public string LblNoCourse { get; set; }
        public string LblNoDepartments { get; set; }
        public string LblNoFilterNoCourse { get; set; }
        public string LblNoInstructor { get; set; }
        public string LblNoOptions { get; set; }
        public string LblOptions { get; set; }
        public string LblPeriod { get; set; }
        public string LblSelectCourse { get; set; }
        public string LblSelectFilter { get; set; }
        public string LblYear { get; set; }
        public SidebarResources Sidebar { get; set; }
    }

    public class SidebarResources
    {
        public string LblCloseSidebar { get; set; }
        public string LblOpenSidebar { get; set; }
    }
}