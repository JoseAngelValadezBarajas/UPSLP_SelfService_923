// --------------------------------------------------------------------
// <copyright file="AlertReportResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Grades
{
    public class AlertReportResources : LayoutResources
    {
        public string FormatCreditType { get; set; }
        public string FormatPeriod { get; set; }
        public string FormatSectionSubType { get; set; }
        public string LblAlert { get; set; }
        public string LblCategory { get; set; }
        public string LblCourse { get; set; }
        public string LblDate { get; set; }
        public string LblDateEdited { get; set; }
        public string LblDateOcurred { get; set; }
        public string LblDescription { get; set; }
        public string LblEditedBy { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblNoAlerts { get; set; }
        public string LblPageTitle { get; set; }
        public string LblPeriod { get; set; }
        public string LblType { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
    }
}