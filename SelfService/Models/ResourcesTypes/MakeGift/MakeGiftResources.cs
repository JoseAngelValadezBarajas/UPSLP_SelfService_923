// --------------------------------------------------------------------
// <copyright file="MakeGiftResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Donations
{
    public class MakeGiftResources : LayoutResources
    {
        public string BtnAddNew { get; set; }
        public string BtnContinue { get; set; }
        public string BtnDelete { get; set; }
        public string BtnMakePayment { get; set; }
        public string LblAmount { get; set; }
        public string LblAmountRequired { get; set; }
        public string LblContributing { get; set; }
        public string LblContributingRequired { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblLegend { get; set; }
        public string LblMakeGift { get; set; }
        public string LblNotAvailable { get; set; }
        public string LblPageTitle { get; set; }
        public string LblPaymentSuccess { get; set; }
        public string LblProceedPayment { get; set; }
        public string LblUniqueCampaign { get; set; }
    }
}