// --------------------------------------------------------------------
// <copyright file="InquiryFormResources.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Admissions
{
    public class InquiryFormResources : LayoutResources
    {
        public AddressSearchModal AddressSearchModal { get; set; }
        public ApplicationHandler ApplicationHandler { get; set; }
        public EtsSearchModal EtsSearchModal { get; set; }
        public string FormatDateOutOfRange { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
    }
}