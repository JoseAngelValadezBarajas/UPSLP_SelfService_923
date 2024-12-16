// --------------------------------------------------------------------
// <copyright file="DegreeRequirementsResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Planning
{
    public class DegreeRequirementsClassification
    {
        public DegreeRequirementsCourses DegreeRequirementsCourses { get; set; }
        public string LblCredits { get; set; }
        public string LblMax { get; set; }
        public string LblMin { get; set; }
        public string LblNoClassificationsAvailable { get; set; }
    }

    public class DegreeRequirementsCourses
    {
        public string FormatFindSections { get; set; }
        public string FormatSectionDetail { get; set; }
        public string FormatViewDetails { get; set; }
        public string LblAnd { get; set; }
        public string LblCourseDetail { get; set; }
        public string LblFindSections { get; set; }
        public string LblMinimumGrade { get; set; }
        public string LblNoCoursesAvailable { get; set; }
        public string LblOr { get; set; }
        public string LblRequired { get; set; }
        public string LblSequence { get; set; }
        public string LblSubTypeDetail { get; set; }
        public string LblViewDetails { get; set; }
        public string LblYes { get; set; }
    }

    public class DegreeRequirementsDisciplines
    {
        public DegreeRequirementsClassification DegreeRequirementsClassification { get; set; }
        public string LblCredits { get; set; }
        public string LblMax { get; set; }
        public string LblMin { get; set; }
    }

    public class DegreeRequirementsHeader
    {
        public string LblCourse { get; set; }
        public string LblDiscipline { get; set; }
        public string LblMax { get; set; }
        public string LblMin { get; set; }
    }

    public class DegreeRequirementsOptions
    {
        public string LblDegree { get; set; }
        public string LblPeriod { get; set; }
        public string LblProgram { get; set; }
    }

    public class DegreeRequirementsResources : LayoutResources
    {
        public CourseDetailModalResources CourseDetailModal { get; set; }
        public CoursePopOverResources CoursePopOver { get; set; }
        public CoursesModalResources CoursesModal { get; set; }
        public DegreeRequirementsDisciplines DegreeRequirementsDisciplines { get; set; }
        public DegreeRequirementsHeader DegreeRequirementsHeader { get; set; }
        public DegreeRequirementsOptions DegreeRequirementsOptions { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblNoDisciplinesAvailable { get; set; }
        public string LblNoPeriodsAvailable { get; set; }
        public string LblPageInstructions { get; set; }
        public string LblPageTitle { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
        public SectionSearchModalResources SectionSearchModal { get; set; }
    }
}