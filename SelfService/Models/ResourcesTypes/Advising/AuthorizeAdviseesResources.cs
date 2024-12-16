// --------------------------------------------------------------------
// <copyright file="AuthorizeAdviseesResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Advising
{
    public class AuthorizeAdviseesResources : LayoutResources
    {
        public AdviseesSearchOptions AdviseesSearchOptions { get; set; }
        public AuthorizeAdviseesTable AuthorizeAdviseesTable { get; set; }
        public string LblAllStudents { get; set; }
        public string LblAlumni { get; set; }
        public string LblCancel { get; set; }
        public string LblConfirmationSearch { get; set; }
        public string LblConfirmTitle { get; set; }
        public string LblEmptyState { get; set; }
        public string LblFormerAdvisees { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblMyAdvisees { get; set; }
        public string LblMyAssociations { get; set; }
        public string LblMyCampus { get; set; }
        public string LblMyDepartment { get; set; }
        public string LblMySharedAdvisees { get; set; }
        public string LblMyStudents { get; set; }
        public string LblNoAdvisees { get; set; }
        public string LblPageTitle { get; set; }
        public string LblSearch { get; set; }
        public string LblSearchInstructions { get; set; }
    }

    public class AuthorizeAdviseesTable
    {
        public string FormatResultsShowing { get; set; }
        public string FormatSelectAdvisee { get; set; }
        public string LblAuthorization { get; set; }
        public string LblAuthorize { get; set; }
        public string LblAuthorized { get; set; }
        public string LblEmailSelected { get; set; }
        public string LblId { get; set; }
        public string LblName { get; set; }
        public string LblPeriod { get; set; }
        public string LblStopList { get; set; }
        public string LblUnauthorize { get; set; }
        public string LblUnauthorized { get; set; }
    }
}