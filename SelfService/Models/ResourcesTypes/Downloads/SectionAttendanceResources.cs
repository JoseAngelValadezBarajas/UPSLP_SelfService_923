// --------------------------------------------------------------------
// <copyright file="SectionAttendanceResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Downloads
{
    public class SectionAttendanceDailyResources
    {
        public string LblAttendanceStatus { get; set; }
        public string LblEmail { get; set; }
        public string LblName { get; set; }
        public string LblPeopleId { get; set; }
        public string LblWithdrawn { get; set; }
    }

    public class SectionAttendanceResources
    {
        public string LblAttendanceStatus { get; set; }
        public string LblComments { get; set; }
        public string LblEmail { get; set; }
        public string LblExcusedAbsence { get; set; }
        public string LblExcusedTardiness { get; set; }
        public string LblLastDateAttended { get; set; }
        public string LblName { get; set; }
        public string LblOverallAttendance { get; set; }
        public string LblPeopleId { get; set; }
        public string LblUnexcusedAbsence { get; set; }
        public string LblUnexcusedTardiness { get; set; }
        public string LblWithdrawn { get; set; }
    }
}