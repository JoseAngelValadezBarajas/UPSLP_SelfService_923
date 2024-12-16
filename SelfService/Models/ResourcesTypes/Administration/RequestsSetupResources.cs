// --------------------------------------------------------------------
// <copyright file="RequestsSetupResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class RequestsSetupResources
    {
        public string LblEmptyState { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
        public RequestsSetupTabs RequestsSetupTabs { get; set; }
    }

    public class RequestsSetupTabs
    {
        public string LblAddressRequests { get; set; }
        public string LblDemographicRequests { get; set; }
        public string LblPreferredNameRequests { get; set; }
    }
}