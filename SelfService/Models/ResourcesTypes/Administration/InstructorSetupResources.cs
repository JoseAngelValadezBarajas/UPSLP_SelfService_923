// --------------------------------------------------------------------
// <copyright file="InstructorSetupResources.cs" company="Ellucian">
//     Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class InstructorSetupResources : LayoutResources
    {
        public InstructorSetupTabs InstructorSetupTabs { get; set; }
        public string LblEmptyState { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
    }

    public class InstructorSetupTabs
    {
        public string LblAdvisorWarnings { get; set; }
        public string LblAssociationHead { get; set; }
        public string LblCampusCoordinator { get; set; }
        public string LblDepartmentHead { get; set; }
        public string LblFacultyPages { get; set; }
        public string LblOffices { get; set; }
    }
}