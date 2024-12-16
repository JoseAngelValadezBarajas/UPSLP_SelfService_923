// --------------------------------------------------------------------
// <copyright file="StudentsResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Search
{
    public class StudentsResources : LayoutResources
    {
        public string LblHeaderTitle { get; set; }
        public string LblNoStudents { get; set; }
        public string LblNotAvailable { get; set; }
        public string LblPageTitle { get; set; }
    }
}