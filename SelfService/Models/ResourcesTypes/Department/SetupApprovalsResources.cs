// --------------------------------------------------------------------
// <copyright file="SetupApprovalsResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Department
{
    public class SectionApprovalCard
    {
        public string FormatSessionSectionSubtype { get; set; }
        public string FormatTitleSection { get; set; }
        public string FormatTypeDuration { get; set; }
        public string LblNoInstructor { get; set; }
        public string LblRequiresApproval { get; set; }
    }

    public class SetupApprovalsResources : LayoutResources
    {
        public string LblDepartment { get; set; }
        public string LblFilter { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblInstructor { get; set; }
        public string LblNoCourses { get; set; }
        public string LblNoDepartments { get; set; }
        public string LblNoFilterNoPeriod { get; set; }
        public string LblNoOptions { get; set; }
        public string LblOptions { get; set; }
        public string LblPageTitle { get; set; }
        public string LblPeriod { get; set; }
        public string LblSelectFilter { get; set; }
        public string LblSelectPeriod { get; set; }
        public string LblYear { get; set; }
        public SectionApprovalCard SectionApprovalCard { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
    }
}