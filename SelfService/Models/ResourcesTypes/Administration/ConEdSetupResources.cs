// --------------------------------------------------------------------
// <copyright file="ConEdSetupResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class ConEdSetupResources : LayoutResources
    {
        public ConEdSetupTabs ConEdSetupTabs { get; set; }
        public string LblEmptyState { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
    }

    public class ConEdSetupTabs
    {
        public string LblConEdDefaults { get; set; }
        public string LblConEdRegistration { get; set; }
    }
}