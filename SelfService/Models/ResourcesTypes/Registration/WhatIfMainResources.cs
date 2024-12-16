// --------------------------------------------------------------------
// <copyright file="WhatIfMainResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Registration
{
    public class AvailableWhatIf
    {
        public string BtnDelete { get; set; }
        public string FormatName { get; set; }
        public string FormatPercentage { get; set; }
        public string FormatPeriod { get; set; }
        public string LblEmptyState { get; set; }
        public string LblRequiredCredits { get; set; }
        public string LblTitle { get; set; }
    }

    public class WhatIfMainResources
    {
        public AcademicPlanDisciplines AcademicPlanDisciplines { get; set; }
        public AcademicPlanExtraCourses AcademicPlanExtraCourses { get; set; }
        public AcademicPlanHeader AcademicPlanHeader { get; set; }
        public AvailableWhatIf AvailableWhatIf { get; set; }
        public CourseDetailModalResources CourseDetailModal { get; set; }
        public CoursePopOverResources CoursePopOver { get; set; }
        public CoursesModalResources CoursesModal { get; set; }
        public ConfirmationDialogResources DeleteWhatIfConfirmation { get; set; }
        public string LblBreadcrumbs { get; set; }
        public string LblNoInformation { get; set; }
        public SectionDetailModalResources SectionDetailModal { get; set; }
        public SectionSearchModalResources SectionSearchModal { get; set; }
        public WhatIfOptions WhatIfOptions { get; set; }
    }

    public class WhatIfOptions
    {
        public string BtnCreate { get; set; }
        public string LblDegree { get; set; }
        public string LblInstructions { get; set; }
        public string LblPeriod { get; set; }
        public string LblProgram { get; set; }
        public string LblTitle { get; set; }
        public string LblWhatIfNoMore { get; set; }
    }
}