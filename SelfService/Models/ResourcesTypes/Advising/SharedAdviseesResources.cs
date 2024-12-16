// --------------------------------------------------------------------
// <copyright file="SharedAdviseesResources.cs" company="Ellucian">
//     Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Advising
{
    public class RelatedAdvisorsTable
    {
        public string BtnDelete { get; set; }
        public string LblSharedWith { get; set; }
    }

    public class SharedAdviseesResources : LayoutResources
    {
        public string BtnDeleteSelected { get; set; }
        public string BtnEmailSelected { get; set; }
        public ConfirmationDialogResources DeleteAdviseesConfirmation { get; set; }
        public ConfirmationDialogResources DeleteAdvisorConfirmation { get; set; }
        public string FormatNumberOfRows { get; set; }
        public string LblEmptyList { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
        public SharedAdviseesTable SharedAdviseesTable { get; set; }
    }

    public class SharedAdviseesTable
    {
        public string FormatSelectAdvisee { get; set; }
        public RelatedAdvisorsTable RelatedAdvisorsTable { get; set; }
    }
}