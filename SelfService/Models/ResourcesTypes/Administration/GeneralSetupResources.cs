// --------------------------------------------------------------------
// <copyright file="GeneralSetupResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class GeneralSetupResources : LayoutResources
    {
        public GeneralSetupTabs GeneralSetupTabs { get; set; }
        public string LblEmptyState { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
    }

    public class GeneralSetupTabs
    {
        public string LblChecklist { get; set; }
        public string LblDashboardMessages { get; set; }
        public string LblDossier { get; set; }
        public string LblPeriodFilters { get; set; }
    }
}