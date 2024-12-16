// --------------------------------------------------------------------
// <copyright file="BalanceMainResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Finances
{
    public class BalanceByChargesCredits
    {
        public string LblAnticipatedFinancialAidHeader { get; set; }
        public string LblChargesHeader { get; set; }
        public string LblCreditsHeader { get; set; }
        public string LblNoAnticipatedFinancialAid { get; set; }
        public string LblNoCharges { get; set; }
        public string LblNoCredits { get; set; }
        public string LblSeparator { get; set; }
        public string LblTotal { get; set; }
    }

    public class BalanceBySummary
    {
        public string LblAmount { get; set; }
        public string LblSeparator { get; set; }
        public string LblSummaryType { get; set; }
    }

    public class BalanceBySummaryType
    {
        public string LblDetailsNotAvailable { get; set; }
        public string LblSeparator { get; set; }
        public string LblTotal { get; set; }
    }

    public class BalanceDetailTable
    {
        public string LblAmount { get; set; }
        public string LblDate { get; set; }
        public string LblDescription { get; set; }
        public string LblDueDate { get; set; }
        public string LblEstimatedLateFee { get; set; }
        public string LblPeriod { get; set; }
        public string LblSeparator { get; set; }
        public string LblType { get; set; }
        public string LblTypeChargeDesc { get; set; }
        public string LblTypeCreditDesc { get; set; }
        public string LblTypeFinAidDesc { get; set; }
        public string LblTypeReceiptDesc { get; set; }
    }

    public class BalanceFooter
    {
        public string FormatPeriodSession { get; set; }
        public string LblAnticipatedBalance { get; set; }
        public string LblAnticipatedFinancialAid { get; set; }
        public string LblBalance { get; set; }
        public string LblBalanceDue { get; set; }
        public string LblChargesHeader { get; set; }
        public string LblNotes { get; set; }
        public string LblOtherPeriodsSessions { get; set; }
        public string LblSeparator { get; set; }
        public string LblSummaryTotal { get; set; }
        public string LblTotal { get; set; }
    }

    public class BalanceHeader
    {
        public string FormatHeader { get; set; }
        public string LblInstructions { get; set; }
        public string LblInstructionsSummary { get; set; }
        public string LblTotal { get; set; }
    }

    public class BalanceMainResources : LayoutResources
    {
        public BalanceByChargesCredits BalanceByChargesCredits { get; set; }
        public BalanceBySummary BalanceBySummary { get; set; }
        public BalanceBySummaryType BalanceBySummaryType { get; set; }
        public BalanceDetailTable BalanceDetailTable { get; set; }
        public BalanceFooter BalanceFooter { get; set; }
        public BalanceHeader BalanceHeader { get; set; }
        public BalanceOptions BalanceOptions { get; set; }
        public string LblAll { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblNoBalance { get; set; }
        public string LblNoBalanceForPeriod { get; set; }
        public string LblOptionByCharges { get; set; }
        public string LblOptionBySummary { get; set; }
        public string LblOptionBySummaryType { get; set; }
        public string LblPageTitle { get; set; }
    }

    public class BalanceOptions
    {
        public string BtnMakePayment { get; set; }
        public string LblMakePayment { get; set; }
        public string LblOptions { get; set; }
        public string LblPaymentAmount { get; set; }
        public string LblPaymentAmountInvalid { get; set; }
        public string LblPaymentAmountRequired { get; set; }
        public string LblPaymentPeriod { get; set; }
        public string LblPaymentPeriodRequired { get; set; }
        public string LblPeriod { get; set; }
        public string LblView { get; set; }
    }
}