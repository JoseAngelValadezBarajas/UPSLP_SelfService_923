// --------------------------------------------------------------------
// <copyright file="RegistrationSummaryMainResources.cs" company="Ellucian">
//     Copyright 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;
using SelfService.Models.ResourcesTypes.Shared;

namespace SelfService.Models.ResourcesTypes.Account
{
    public class RegistrationSummaryMainResources
    {
        public string LblDate { get; set; }
        public string LblLog { get; set; }
        public string LblNoResults { get; set; }
        public string LblRegistrationSummary { get; set; }
        public string LblYearTerm { get; set; }
        public RegistrationSummaryModalResources RegistrationSummaryModal { get; set; }
        public StudentCourseMessagesResources StudentCourseMessages { get; set; }
        public StudentCourseStatusResources StudentCourseStatus { get; set; }
    }
}