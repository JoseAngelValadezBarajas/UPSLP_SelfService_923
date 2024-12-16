// --------------------------------------------------------------------
// <copyright file="StudentSetupResources.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class StudentSetupResources : LayoutResources
    {
        public string LblEmptyState { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
        public StudentSetupTabs StudentSetupTabs { get; set; }
    }

    public class StudentSetupTabs
    {
        public string LblAgreements { get; set; }
        public string LblBlockRegistration { get; set; }
        public string LblFinancialSettings { get; set; }
        public string LblGradeMappings { get; set; }
        public string LblRegistrationGroups { get; set; }
        public string LblSettings1098T { get; set; }
        public string lblSharedAccess { get; set; }
        public string LblStudentRecords { get; set; }
        public string LblTraditionalDefaults { get; set; }
        public string LblTraditionalRegistration { get; set; }
        public string LblTranscriptRequest { get; set; }
    }
}