// --------------------------------------------------------------------
// <copyright file="DailyAttendanceResources.cs" company="Ellucian">
//     Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Classes
{
    public class DailyAttendanceResources
    {
        public string BtnAddNotes { get; set; }
        public string BtnCancel { get; set; }
        public string BtnDailyAttendance { get; set; }
        public string BtnEditNotes { get; set; }
        public string BtnSave { get; set; }
        public DailyAttendanceTable DailyAttendanceTable { get; set; }
        public string FormatBuilding { get; set; }
        public string FormatDailyAttendance { get; set; }
        public string FormatDailyCalendar { get; set; }
        public string FormatDailyCalendarHours { get; set; }
        public string FormatFloor { get; set; }
        public string FormatOrganization { get; set; }
        public string FormatRoom { get; set; }
        public string FormatTruncatedNotes { get; set; }
        public string LblAddNotes { get; set; }
        public string LblEditNotes { get; set; }
        public string LblHideCalendar { get; set; }
        public string LblMissing { get; set; }
        public string LblNoDailyAttendance { get; set; }
        public string LblNotes { get; set; }
        public string LblSchedule { get; set; }
        public string LblSelected { get; set; }
        public string LblShowCalendar { get; set; }
        public string LblTakeAttendance { get; set; }
        public string LblTaken { get; set; }
    }

    public class DailyAttendanceTable
    {
        public string BtnSave { get; set; }
        public string LblApplyStatus { get; set; }
        public string LblAttendanceStatus { get; set; }
        public string LblComments { get; set; }
        public string LblDailyAttendance { get; set; }
        public string LblDownload { get; set; }
        public string LblDownloadDailyName { get; set; }
        public string LblDropDownEmptyText { get; set; }
        public string LblName { get; set; }
        public string LblNoResults { get; set; }
        public string LblToday { get; set; }
        public string LblWithdrawn { get; set; }
    }
}