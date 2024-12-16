// --------------------------------------------------------------------
// <copyright file="SectionsResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Generic
{
    public class SectionInstructorsResources
    {
        public string LblInstructors { get; set; }
        public string LblNoInstructor { get; set; }
    }

    public class SectionSchedulesResources
    {
        public string FormatBuilding { get; set; }
        public string FormatFloor { get; set; }
        public string FormatOrganization { get; set; }
        public string FormatRoom { get; set; }
        public string FormatStartEndTime { get; set; }
        public string LblNoSchedule { get; set; }
        public string LblSchedules { get; set; }
        public string LblTimeConflicts { get; set; }
    }

    public class SectionsResources
    {
        public string BtnCalendarView { get; set; }
        public string BtnListView { get; set; }
        public string FormatDuration { get; set; }
        public string FormatSession { get; set; }
        public string FormatSubtypeSection { get; set; }
        public string FormatTitleSection { get; set; }
        public string FormatTypeCreditTypeCeu { get; set; }
        public string FormatTypeCreditTypeCredits { get; set; }
        public string LblCourse { get; set; }
        public string LblDenied { get; set; }
        public string LblInCart { get; set; }
        public string LblPending { get; set; }
        public string LblRegistered { get; set; }
        public string LblStatus { get; set; }
        public string LblTimeConflicts { get; set; }
        public ScheduleCalendarResources ScheduleCalendar { get; set; }
        public SectionInstructorsResources SectionInstructors { get; set; }
        public SectionSchedulesResources SectionSchedules { get; set; }
    }
}