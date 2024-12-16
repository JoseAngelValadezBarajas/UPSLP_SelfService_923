// --------------------------------------------------------------------
// <copyright file="BlockResources.cs" company="Ellucian">
//     Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class BlockResources
    {
        public BlockSectionSearch BlockSectionSearch { get; set; }
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
        public string FormatTitlePeriod { get; set; }
        public string LblActive { get; set; }
        public string LblAddBlock { get; set; }
        public string LblAddBlockTitle { get; set; }
        public string LblAddSection { get; set; }
        public string LblAllowChanges { get; set; }
        public string LblAllowChangesDesc { get; set; }
        public string LblBlockInUse { get; set; }
        public string LblBlockTimeConflict { get; set; }
        public string LblDescription { get; set; }
        public string LblDisplayName { get; set; }
        public string LblDisplayNameError { get; set; }
        public string LblDuplicateNameError { get; set; }
        public string LblEditBlockTitle { get; set; }
        public string LblEmptyBlock { get; set; }
        public string LblName { get; set; }
        public string LblNameError { get; set; }
        public string LblNoSections { get; set; }
        public string LblSections { get; set; }
    }

    public class BlockSectionInstructors
    {
        public string LblInstructors { get; set; }
        public string LblNoInstructor { get; set; }
    }

    public class BlockSections
    {
        public BlockSectionInstructors BlockSectionInstructors { get; set; }
        public BlockSectionSchedules BlockSectionSchedules { get; set; }
        public string BtnCalendarView { get; set; }
        public string BtnDelete { get; set; }
        public string BtnListView { get; set; }
        public string FormatCourseDescription { get; set; }
        public string FormatSelectCourse { get; set; }
        public string LblCourse { get; set; }
        public string LblCourseType { get; set; }
        public string LblName { get; set; }
        public string LblTimeConflicts { get; set; }
        public string LblType { get; set; }
        public ScheduleCalendarResources ScheduleCalendar { get; set; }
    }

    public class BlockSectionSchedules
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

    public class BlockSectionSearch
    {
        public BlockSections BlockSections { get; set; }
        public string BtnAdd { get; set; }
        public string BtnAddAndSearch { get; set; }
        public string BtnCancel { get; set; }
        public string BtnClearSearch { get; set; }
        public string BtnNewSearch { get; set; }
        public string BtnRefineSearch { get; set; }
        public string BtnSearch { get; set; }
        public string FormatCampus { get; set; }
        public string FormatCourse { get; set; }
        public string FormatCourseType { get; set; }
        public string FormatEndsBy { get; set; }
        public string FormatInstructor { get; set; }
        public string FormatKeyword { get; set; }
        public string FormatMeeting { get; set; }
        public string FormatSelected { get; set; }
        public string FormatSession { get; set; }
        public string FormatStartsFrom { get; set; }
        public string FormatSubtype { get; set; }
        public string LblCampus { get; set; }
        public string LblCourse { get; set; }
        public string LblCourseDetails { get; set; }
        public string LblCourseType { get; set; }
        public string LblEndsBy { get; set; }
        public string LblInstructor { get; set; }
        public string LblKeyword { get; set; }
        public string LblMeeting { get; set; }
        public string LblNoResults { get; set; }
        public string LblResultsFound { get; set; }
        public string LblSession { get; set; }
        public string LblSpecifyParameters { get; set; }
        public string LblStartsFrom { get; set; }
        public string LblSubTitle { get; set; }
        public string LblSubtype { get; set; }
        public string LblTimeLocation { get; set; }
        public string LblTitle { get; set; }
    }
}