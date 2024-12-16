// --------------------------------------------------------------------
// <copyright file="FinancialAidViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Finances.FinancialAid
{
    /// <summary>
    /// FinAidAwardTermViewModel
    /// </summary>
    public class FinAidAwardTermViewModel
    {
        /// <summary>
        /// Gets or sets the award term description.
        /// </summary>
        /// <value>
        /// The award term description.
        /// </value>
        public string AwardTermDescription { get; set; }

        /// <summary>
        /// Gets or sets the funds.
        /// </summary>
        /// <value>
        /// The funds.
        /// </value>
        public List<FinAidFundViewModel> Funds { get; set; }

        /// <summary>
        /// Gets or sets the total fund amount by term.
        /// </summary>
        /// <value>
        /// The total fund amount by term.
        /// </value>
        public string TotalActualAmountByTerm { get; set; }

        /// <summary>
        /// Gets or sets the total scheduled amount by term.
        /// </summary>
        /// <value>
        /// The total scheduled amount by term.
        /// </value>
        public string TotalScheduledAmountByTerm { get; set; }
    }

    /// <summary>
    /// FinAidCategoryViewModel
    /// </summary>
    public class FinAidCategoryViewModel
    {
        /// <summary>
        /// Gets or sets the amount.
        /// </summary>
        /// <value>
        /// The amount.
        /// </value>
        public string Amount { get; set; }

        /// <summary>
        /// Gets or sets the category.
        /// </summary>
        /// <value>
        /// The category.
        /// </value>
        public string Category { get; set; }
    }

    /// <summary>
    /// FinAidDocumentViewModel
    /// </summary>
    public class FinAidDocumentViewModel
    {
        /// <summary>
        /// Gets or sets the name of the document.
        /// </summary>
        /// <value>
        /// The name of the document.
        /// </value>
        public string DocName { get; set; }

        /// <summary>
        /// Gets or sets the document status description.
        /// </summary>
        /// <value>
        /// The document status description.
        /// </value>
        public string DocStatusDescription { get; set; }

        /// <summary>
        /// Gets or sets the status effective date.
        /// </summary>
        /// <value>
        /// The status effective date.
        /// </value>
        public string StatusEffectiveDate { get; set; }
    }

    /// <summary>
    /// FinAidFundViewModel
    /// </summary>
    public class FinAidFundViewModel
    {
        /// <summary>
        /// Gets or sets the total fund amount.
        /// </summary>
        /// <value>
        /// The total fund amount.
        /// </value>
        public string ActualAmount { get; set; }

        /// <summary>
        /// Gets or sets the name of the fund.
        /// </summary>
        /// <value>
        /// The name of the fund.
        /// </value>
        public string FundName { get; set; }

        /// <summary>
        /// Gets or sets the scheduled term amount.
        /// </summary>
        /// <value>
        /// The scheduled term amount.
        /// </value>
        public string ScheduledTermAmount { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public string Status { get; set; }
    }

    /// <summary>
    /// FinAidLoanViewModel
    /// </summary>
    public class FinAidLoanViewModel
    {
        /// <summary>
        /// Gets or sets the application received.
        /// </summary>
        /// <value>
        /// The application received.
        /// </value>
        public string ApplicationReceived { get; set; }

        /// <summary>
        /// Gets or sets the interest rate.
        /// </summary>
        /// <value>
        /// The interest rate.
        /// </value>
        public string InterestRate { get; set; }

        /// <summary>
        /// Gets or sets the lender approved date.
        /// </summary>
        /// <value>
        /// The lender approved date.
        /// </value>
        public string LenderApprovedDate { get; set; }

        /// <summary>
        /// Gets or sets the name of the lender.
        /// </summary>
        /// <value>
        /// The name of the lender.
        /// </value>
        public string LenderName { get; set; }

        /// <summary>
        /// Gets or sets the loan identifier.
        /// </summary>
        /// <value>
        /// The loan identifier.
        /// </value>
        public string LoanIdentifier { get; set; }

        /// <summary>
        /// Gets or sets the loan requested.
        /// </summary>
        /// <value>
        /// The loan requested.
        /// </value>
        public string LoanRequested { get; set; }

        /// <summary>
        /// Gets or sets the period begin date.
        /// </summary>
        /// <value>
        /// The period begin date.
        /// </value>
        public string PeriodBeginDate { get; set; }

        /// <summary>
        /// Gets or sets the period end date.
        /// </summary>
        /// <value>
        /// The period end date.
        /// </value>
        public string PeriodEndDate { get; set; }

        /// <summary>
        /// Gets or sets the signature date.
        /// </summary>
        /// <value>
        /// The signature date.
        /// </value>
        public string SignatureDate { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public string Status { get; set; }
    }

    public class FinAidPackagingViewModel
    {
        /// <summary>
        /// Gets or sets the student budget.
        /// </summary>
        /// <value>
        /// The student budget.
        /// </value>
        public List<FinAidCategoryViewModel> StudentBudget { get; set; }

        /// <summary>
        /// Gets or sets the financial aid.
        /// </summary>
        /// <value>
        /// The financial aid.
        /// </value>
        public List<FinAidCategoryViewModel> StudentFinancialAid { get; set; }

        /// <summary>
        /// Gets or sets the student need.
        /// </summary>
        /// <value>
        /// The student need.
        /// </value>
        public List<FinAidCategoryViewModel> StudentNeed { get; set; }
    }

    /// <summary>
    /// FinancialAidViewModel
    /// </summary>
    public class FinancialAidViewModel
    {
        /// <summary>
        /// Gets or sets the award terms.
        /// </summary>
        /// <value>
        /// The award terms.
        /// </value>
        public List<FinAidAwardTermViewModel> AwardTerms { get; set; }

        public bool DisplayUnmetNeed { get; set; }

        /// <summary>
        /// Gets or sets the documents.
        /// </summary>
        /// <value>
        /// The documents.
        /// </value>
        public List<FinAidDocumentViewModel> Documents { get; set; }

        /// <summary>
        /// Gets or sets the loans.
        /// </summary>
        /// <value>
        /// The loans.
        /// </value>
        public List<FinAidLoanViewModel> Loans { get; set; }

        /// <summary>
        /// Gets or sets the messages.
        /// </summary>
        /// <value>
        /// The messages.
        /// </value>
        public List<string> Messages { get; set; }

        /// <summary>
        /// Gets or sets the packaging.
        /// </summary>
        /// <value>
        /// The packaging.
        /// </value>
        public List<FinAidPackagingViewModel> Packaging { get; set; }
    }
}