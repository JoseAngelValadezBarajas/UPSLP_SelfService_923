// --------------------------------------------------------------------
// <copyright file="SectionResources.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;
using SelfService.Models.ResourcesTypes.Registration;

namespace SelfService.Models.ResourcesTypes.Search
{
    public class SectionResources
    {
        public AdvancedSearchModal AdvancedSearchModal { get; set; }
        public string BtnSearch { get; set; }
        public string FormatResultsShowing { get; set; }
        public string LblAdvancedSearch { get; set; }
        public string LblClearAll { get; set; }
        public string LblCourseCode { get; set; }
        public string LblFilters { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblNewSearch { get; set; }
        public string LblNoResults { get; set; }
        public string LblPageTitle { get; set; }
        public string LblPeriod { get; set; }
        public string LblSelect { get; set; }
        public string LblSession { get; set; }
        public string LblShareSearch { get; set; }
        public string LblSpecifySearch { get; set; }
        public SectionCardResources SectionCard { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
        public ShareSearchCourseLinkModalResources ShareSearchCourseLinkModalResources { get; set; }
    }
}