// --------------------------------------------------------------------
// <copyright file="FormsSetupResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class FormsSetupResources : LayoutResources
    {
        public FormsSetupTabs FormsSetupTabs { get; set; }
        public string LblEmptyState { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
    }

    public class FormsSetupTabs
    {
        public string LblApplicationFormSetup { get; set; }

        public string LblInquiryFormSetup { get; set; }
    }
}