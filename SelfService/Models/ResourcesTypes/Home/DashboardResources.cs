// --------------------------------------------------------------------
// <copyright file="DashboardResources.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Home
{
    public class DashboardCalendar
    {
        public string BtnClassList { get; set; }
        public string BtnDownload { get; set; }
        public string BtnViewCalendar { get; set; }
        public string BtnViewNotes { get; set; }
        public string FormatBuilding { get; set; }
        public string FormatFloor { get; set; }
        public string FormatOrganization { get; set; }
        public string FormatRoom { get; set; }
        public string FormatSubtype { get; set; }
        public string FormatTime { get; set; }
        public string FormatTitleSection { get; set; }
        public string LblNoEvents { get; set; }
        public string LblNotes { get; set; }
        public string LblStudying { get; set; }
        public string LblTeaching { get; set; }
        public string LblYourCalendar { get; set; }
    }

    public class DashboardChecklist
    {
        public string BtnViewChecklist { get; set; }
        public string LblMyTasks { get; set; }
        public string LblOverdue { get; set; }
        public string LblToday { get; set; }
        public string LblUpcoming { get; set; }
        public string LblUpToDate { get; set; }
    }

    public class DashboardResources : LayoutResources
    {
        public DashboardCalendar DashboardCalendar { get; set; }
        public DashboardChecklist DashboardChecklist { get; set; }
        public DashboardStatus DashboardStatus { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
    }

    public class DashboardStatus
    {
        public string BtnDegreeProgress { get; set; }
        public string LblAcademic { get; set; }
        public string LblCore { get; set; }
        public string LblElective { get; set; }
        public string LblGraduationDate { get; set; }
    }
}