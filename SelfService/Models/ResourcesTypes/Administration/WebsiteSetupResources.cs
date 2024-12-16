// --------------------------------------------------------------------
// <copyright file="WebsiteSetupResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class WebsiteSetupResources : LayoutResources
    {
        public string LblEmptyState { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
        public WebsiteSetupTabsResources WebsiteSetupTabs { get; set; }
    }

    public class WebsiteSetupTabsResources
    {
        public string LblCourseMaterials { get; set; }
        public string LblEmailProvider { get; set; }
        public string LblGlobalSettings { get; set; }
        public string LblNameFormatCategories { get; set; }
        public string LblNameFormats { get; set; }
        public string LblPaymentProvider { get; set; }
        public string LblPermissionStore { get; set; }
        public string LblReCaptcha { get; set; }
        public string LblSiteSettings { get; set; }
        public string LblSystemInformation { get; set; }
        public string LblTheme { get; set; }
    }
}