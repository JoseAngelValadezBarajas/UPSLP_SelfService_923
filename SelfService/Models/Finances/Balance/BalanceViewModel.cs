// --------------------------------------------------------------------
// <copyright file="BalanceViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Finances
{
    /// <summary>
    /// BalanceByChargesViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Finances.BalanceViewModel" />
    public class BalanceByChargesViewModel : BalanceViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="BalanceByChargesViewModel" /> class.
        /// </summary>
        /// <param name="balanceViewModel">The balance view model.</param>
        public BalanceByChargesViewModel(BalanceViewModel balanceViewModel) : base(balanceViewModel) { }

        /// <summary>
        /// Gets or sets the charges.
        /// </summary>
        /// <value>
        /// The charges.
        /// </value>
        public List<ChargeCreditViewModel> Charges { get; set; }

        /// <summary>
        /// Gets or sets the credits.
        /// </summary>
        /// <value>
        /// The credits.
        /// </value>
        public List<ChargeCreditViewModel> Credits { get; set; }

        /// <summary>
        /// Gets or sets the financial aids.
        /// </summary>
        /// <value>
        /// The financial aids.
        /// </value>
        public List<ChargeCreditViewModel> FinancialAids { get; set; }

        /// <summary>
        /// Gets or sets the total amount charges.
        /// </summary>
        /// <value>
        /// The total amount charges.
        /// </value>
        public string TotalAmountCharges { get; set; }

        /// <summary>
        /// Gets or sets the total amount credits.
        /// </summary>
        /// <value>
        /// The total amount credits.
        /// </value>
        public string TotalAmountCredits { get; set; }

        /// <summary>
        /// Gets or sets the total amount financial aids.
        /// </summary>
        /// <value>
        /// The total amount financial aids.
        /// </value>
        public string TotalAmountFinancialAids { get; set; }
    }

    /// <summary>
    /// BalanceBySummaryTypeViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Finances.BalanceViewModel" />
    public class BalanceBySummaryTypeViewModel : BalanceViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="BalanceBySummaryTypeViewModel"/> class.
        /// </summary>
        /// <param name="balanceViewModel">The balance view model.</param>
        public BalanceBySummaryTypeViewModel(BalanceViewModel balanceViewModel) : base(balanceViewModel) { }

        /// <summary>
        /// Gets or sets the detail summary types.
        /// </summary>
        /// <value>
        /// The detail summary types.
        /// </value>
        public List<BalanceDetailSummaryTypeViewModel> DetailSummaryTypes { get; set; }
    }

    /// <summary>
    /// BalanceBySummaryViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.Finances.BalanceViewModel" />
    public class BalanceBySummaryViewModel : BalanceViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="BalanceBySummaryViewModel"/> class.
        /// </summary>
        /// <param name="balanceViewModel">The balance view model.</param>
        public BalanceBySummaryViewModel(BalanceViewModel balanceViewModel) : base(balanceViewModel) { }

        /// <summary>
        /// Gets or sets the summary types.
        /// </summary>
        /// <value>
        /// The summary types.
        /// </value>
        public List<BalanceSummaryViewModel> SummaryTypes { get; set; }
    }

    /// <summary>
    /// BalanceDetailSummaryTypeViewModel
    /// </summary>
    public class BalanceDetailSummaryTypeViewModel
    {
        /// <summary>
        /// Gets or sets the charges.
        /// </summary>
        /// <value>
        /// The charges.
        /// </value>
        public List<ChargeCreditViewModel> Charges { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the total amount.
        /// </summary>
        /// <value>
        /// The total amount.
        /// </value>
        public string TotalAmount { get; set; }

        /// <summary>
        /// Gets or sets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        public string Type { get; set; }
    }

    /// <summary>
    ///  BalanceSummaryViewModel
    /// </summary>
    public class BalanceSummaryViewModel
    {
        /// <summary>
        /// Gets or sets the amount.
        /// </summary>
        /// <value>
        /// The amount.
        /// </value>
        public string Amount { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }
    }

    /// <summary>
    /// BalanceViewModel
    /// </summary>
    public class BalanceViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="BalanceViewModel"/> class.
        /// </summary>
        public BalanceViewModel()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="BalanceViewModel" /> class.
        /// </summary>
        /// <param name="balanceViewModel">The balance view model.</param>
        public BalanceViewModel(BalanceViewModel balanceViewModel)
        {
            this.PeriodSummaryTotal = balanceViewModel.PeriodSummaryTotal;
            this.PeriodAnticipatedFinAid = balanceViewModel.PeriodAnticipatedFinAid;
            this.PeriodTotal = balanceViewModel.PeriodTotal;
            this.OtherPeriodsBalance = balanceViewModel.OtherPeriodsBalance;
            this.OtherPeriodsBalanceDue = balanceViewModel.OtherPeriodsBalanceDue;
            this.OtherPeriodsAnticipatedFinAid = balanceViewModel.OtherPeriodsAnticipatedFinAid;
            this.OtherPeriodsAnticipatedBalance = balanceViewModel.OtherPeriodsAnticipatedBalance;
            this.DisplayDueDate = balanceViewModel.DisplayDueDate;
            this.IncludeAnticipatedAid = balanceViewModel.IncludeAnticipatedAid;
            this.DisplayEstimatedLateFees = balanceViewModel.DisplayEstimatedLateFees;
        }

        /// <summary>
        /// Gets or sets a value indicating whether [display due date].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [display due date]; otherwise, <c>false</c>.
        /// </value>
        public bool DisplayDueDate { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [display estimated late fees].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [display estimated late fees]; otherwise, <c>false</c>.
        /// </value>
        public bool DisplayEstimatedLateFees { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [include anticipated aid].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [include anticipated aid]; otherwise, <c>false</c>.
        /// </value>
        public bool IncludeAnticipatedAid { get; set; }

        /// <summary>
        /// Gets or sets the other periods anticipated balance.
        /// </summary>
        /// <value>
        /// The other periods anticipated balance.
        /// </value>
        public string OtherPeriodsAnticipatedBalance { get; set; }

        /// <summary>
        /// Gets or sets the other periods anticipated fin aid.
        /// </summary>
        /// <value>
        /// The other periods anticipated fin aid.
        /// </value>
        public string OtherPeriodsAnticipatedFinAid { get; set; }

        /// <summary>
        /// Gets or sets the other periods balance.
        /// </summary>
        /// <value>
        /// The other periods balance.
        /// </value>
        public string OtherPeriodsBalance { get; set; }

        /// <summary>
        /// Gets or sets the other periods balance due.
        /// </summary>
        /// <value>
        /// The other periods balance due.
        /// </value>
        public string OtherPeriodsBalanceDue { get; set; }

        /// <summary>
        /// Gets or sets the period anticipated fin aid.
        /// </summary>
        /// <value>
        /// The period anticipated fin aid.
        /// </value>
        public string PeriodAnticipatedFinAid { get; set; }

        /// <summary>
        /// Gets or sets the period summary total.
        /// </summary>
        /// <value>
        /// The period summary total.
        /// </value>
        public string PeriodSummaryTotal { get; set; }

        /// <summary>
        /// Gets or sets the period total.
        /// </summary>
        /// <value>
        /// The period total.
        /// </value>
        public string PeriodTotal { get; set; }
    }
}