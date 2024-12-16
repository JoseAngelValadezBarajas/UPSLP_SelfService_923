// --------------------------------------------------------------------
// <copyright file="Form1098TResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Finances
{
    public class AgreementForm1098TModal
    {
        public string BtnCancel { get; set; }
        public string BtnSave { get; set; }
    }

    public class Form1098TResources : LayoutResources
    {
        public AgreementForm1098TModal AgreementForm1098TModal { get; set; }
        public string BtnCancel { get; set; }
        public string BtnReviewAndAccept { get; set; }
        public string BtnReviewTerms { get; set; }
        public string LblAccepted { get; set; }
        public string LblAcceptedMessage { get; set; }
        public string LblConsentTitle { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblMainMessage { get; set; }
        public string LblNoAgreement { get; set; }
        public string LblNotAccepted { get; set; }
        public string LblNotAcceptedMessage { get; set; }
        public string LblPageTitle { get; set; }
        public string LblTaxYearsTitle { get; set; }
        public TaxYears1098T TaxYears1098T { get; set; }
    }

    public class TaxYears1098T
    {
        public string BtnDownload { get; set; }
        public string LblDownloadProcess { get; set; }
        public string LblNoResults { get; set; }
    }
}