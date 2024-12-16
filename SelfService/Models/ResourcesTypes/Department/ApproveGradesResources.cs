// --------------------------------------------------------------------
// <copyright file="ApproveGradesResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Department
{
    public class ApproveGradesResources : LayoutResources
    {
        public string FormatCreditType { get; set; }
        public string FormatSectionSubtype { get; set; }
        public string LblCourse { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblNoCourse { get; set; }
        public string LblNoOptions { get; set; }
        public string LblPageTitle { get; set; }
        public string LblPeriod { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
    }
}