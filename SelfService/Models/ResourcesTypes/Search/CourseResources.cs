// --------------------------------------------------------------------
// <copyright file="CourseResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Search
{
    public class CourseCardResources
    {
        public string FormatTitleSection { get; set; }
        public string FormatTitleSectionShort { get; set; }
        public string LblDescription { get; set; }
        public string LblFindSections { get; set; }
        public string LblSubtypes { get; set; }
    }

    public class CourseResources : LayoutResources
    {
        public CourseCardResources CourseCardResources { get; set; }
        public CourseDetailModalResources CourseDetailModal { get; set; }
        public CourseSearchOptionsResources CourseSearchOptionsResources { get; set; }
        public string FormatResultsShowing { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblNewSearch { get; set; }
        public string lblNoResults { get; set; }
        public string LblPageTitle { get; set; }
        public ShareSearchCourseLinkModalResources ShareSearchCourseLinkModalResources { get; set; }
    }

    public class CourseSearchOptionsResources
    {
        public string BtnSearch { get; set; }
        public string LblClassLevel { get; set; }
        public string LblClearAll { get; set; }
        public string LblCollege { get; set; }
        public string LblCourseCode { get; set; }
        public string LblCreditType { get; set; }
        public string LblCurriculum { get; set; }
        public string LblDepartment { get; set; }
        public string LblFilters { get; set; }
        public string LblNonTraditional { get; set; }
        public string LblPopulation { get; set; }
        public string LblProgram { get; set; }
        public string LblSelect { get; set; }
        public string LblShareSearch { get; set; }
        public string LblSubtype { get; set; }
    }

    public class ShareSearchCourseLinkModalResources
    {
        public string btnOk { get; set; }
        public string lblTitle { get; set; }
        public string lblUrlToShare { get; set; }
    }
}