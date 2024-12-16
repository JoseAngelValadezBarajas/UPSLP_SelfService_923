// --------------------------------------------------------------------
// <copyright file="CourseDetailModalResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Generic
{
    public class CourseDetailModalResources
    {
        public CourseDetailSubTypeResources CourseDetailSubType { get; set; }
        public string FormatCourseName { get; set; }
    }

    public class CourseDetailSubTypeResources
    {
        public string LblCorequisite { get; set; }
        public string LblCredits { get; set; }
        public string LblCreditTypes { get; set; }
        public string LblDescription { get; set; }
        public string LblEmpty { get; set; }
        public string LblFees { get; set; }
        public string LblPrerequisites { get; set; }
    }
}