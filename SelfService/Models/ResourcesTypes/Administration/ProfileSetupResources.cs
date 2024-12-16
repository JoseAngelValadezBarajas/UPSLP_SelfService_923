// --------------------------------------------------------------------
// <copyright file="ProfileSetupResources.cs" company="Ellucian">
//     Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class ProfileSetupResources : LayoutResources
    {
        public string LblEmptyState { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
        public ProfileSetupTabs ProfileSetupTabs { get; set; }
    }

    public class ProfileSetupTabs
    {
        public string LblAddressSettings { get; set; }
        public string LblDemographicSettings { get; set; }
        public string LblEmergencyContactSettings { get; set; }
        public string LblPhoneNumberSettings { get; set; }
        public string LblPreferredNameSettings { get; set; }
    }
}