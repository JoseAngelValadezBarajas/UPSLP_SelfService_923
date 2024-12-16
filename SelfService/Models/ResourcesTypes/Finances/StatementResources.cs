// --------------------------------------------------------------------
// <copyright file="StatementResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Finances
{
    public class StatementInformation
    {
        public string LblAmount { get; set; }
        public string LblAmountEnclosed { get; set; }
        public string LblAmountNotCovered { get; set; }
        public string LblAnticipatedAids { get; set; }
        public string LblCharges { get; set; }
        public string LblCreditCardNumber { get; set; }
        public string LblCreditCardType { get; set; }
        public string LblCredits { get; set; }
        public string LblCurrentBalance { get; set; }
        public string LblDate { get; set; }
        public string LblDescription { get; set; }
        public string LblDueDate { get; set; }
        public string LblExpirationDate { get; set; }
        public string LblFor { get; set; }
        public string LblId { get; set; }
        public string LblInstructions { get; set; }
        public string LblLessAnticipatedCredits { get; set; }
        public string LblLine { get; set; }
        public string LblOtherAmount { get; set; }
        public string LblPageInstructions { get; set; }
        public string LblPaymentDue { get; set; }
        public string LblPaymentDueBy { get; set; }
        public string LblPaymentPlanInformation { get; set; }
        public string LblPeriod { get; set; }
        public string LblPreviousBalance { get; set; }
        public string LblSeparator { get; set; }
        public string LblSignature { get; set; }
        public string LblStatement { get; set; }
        public string LblStatementNumber { get; set; }
        public string LblTotalAnticipated { get; set; }
        public string LblTotalCharges { get; set; }
        public string LblTotalCredits { get; set; }
    }

    public class StatementOptions
    {
        public string LblNumber { get; set; }
        public string LblStatement { get; set; }
    }

    public class StatementResources : LayoutResources
    {
        public string LblHeaderTitle { get; set; }
        public string LblNoStatemenstAvailable { get; set; }
        public string LblOf { get; set; }
        public string LblPage { get; set; }
        public string LblPageTitle { get; set; }
        public PrintResources Printing { get; set; }
        public StatementInformation StatementInformation { get; set; }
        public StatementOptions StatementOptions { get; set; }
    }
}