// --------------------------------------------------------------------
// <copyright file="RegistrationPeriodStatus.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Shared
{
    public class PeriodLongStatus
    {
        public string FormatPeriodEnded { get; set; }
        public string FormatPeriodNotOpen { get; set; }
        public string FormatPeriodNotOpenAuthNeeded { get; set; }
        public string LblAdvisorAuthNeeded { get; set; }
        public string LblNoAdvisorAssigned { get; set; }
        public string LblNoRegGroupFound { get; set; }
        public string LblOnlySearch { get; set; }
    }

    public class PeriodShortStatus
    {
        public string FormatPeriodEnded { get; set; }
        public string FormatPeriodNotOpen { get; set; }
        public string FormatPeriodNotOpenAuthNeeded { get; set; }
        public string LblAdvisorAuthNeeded { get; set; }
        public string LblNoAdvisorAssigned { get; set; }
        public string LblNoRegGroupFound { get; set; }
    }
}