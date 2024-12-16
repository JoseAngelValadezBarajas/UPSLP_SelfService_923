// --------------------------------------------------------------------
// <copyright file="PaymentViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Student;
using SelfService.Models.Finances;
using SelfService.Models.Schedule;
using System.Collections.Generic;

namespace SelfService.Models.Payment
{
    /// <summary>
    /// PaymentDiscountCouponViewModel
    /// </summary>
    public class PaymentDiscountCouponViewModel
    {
        /// <summary>
        /// Gets or sets the code.
        /// </summary>
        /// <value>
        /// The code.
        /// </value>
        public string Code { get; set; }

        /// <summary>
        /// Returns true if ... is valid.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is valid; otherwise, <c>false</c>.
        /// </value>
        public bool IsValid { get; set; }
    }

    /// <summary>
    /// PaymentInfoViewModel
    /// </summary>
    public class PaymentInfoViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="PaymentInfoViewModel"/> class.
        /// </summary>
        public PaymentInfoViewModel() => ChargeCredits = new List<DiscountChargeCreditViewModel>();

        /// <summary>
        /// Gets or sets the application identifier.
        /// </summary>
        /// <value>
        /// The application identifier.
        /// </value>
        public int? ApplicationId { get; set; }

        /// <summary>
        /// Gets or sets the charge credits.
        /// </summary>
        /// <value>
        /// The charge credits.
        /// </value>
        public List<DiscountChargeCreditViewModel> ChargeCredits { get; set; }

        /// <summary>
        /// Gets or sets the con ed transaction identifier.
        /// </summary>
        /// <value>
        /// The con ed transaction identifier.
        /// </value>
        public long? ConEdTransactionId { get; set; }

        /// <summary>
        /// Gets or sets the current balance.
        /// </summary>
        /// <value>
        /// The current balance.
        /// </value>
        public string CurrentBalance { get; set; }

        /// <summary>
        /// Gets or sets the current balance value.
        /// </summary>
        /// <value>
        /// The current balance value.
        /// </value>
        public decimal CurrentBalanceValue { get; set; }

        /// <summary>
        /// Gets or sets the payment due.
        /// </summary>
        /// <value>
        /// The payment due.
        /// </value>
        public string PaymentDue { get; set; }

        /// <summary>
        /// Gets or sets the payment due value.
        /// </summary>
        /// <value>
        /// The payment due value.
        /// </value>
        public decimal PaymentDueValue { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [require online payment].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [require online payment]; otherwise, <c>false</c>.
        /// </value>
        public bool RequireOnlinePayment { get; set; }

        /// <summary>
        /// Gets or sets the statement number.
        /// </summary>
        /// <value>
        /// The statement number.
        /// </value>
        public int? StatementNumber { get; set; }

        /// <summary>
        /// Gets or sets the total amount.
        /// </summary>
        /// <value>
        /// The total amount.
        /// </value>
        public string TotalAmount { get; set; }

        /// <summary>
        /// Gets or sets the total amount value.
        /// </summary>
        /// <value>
        /// The total amount value.
        /// </value>
        public decimal TotalAmountValue { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [use transaction charges only].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [use transaction charges only]; otherwise, <c>false</c>.
        /// </value>
        public bool UseTransactionChargesOnly { get; set; }
    }

    /// <summary>
    /// PaymentRequestModel
    /// </summary>
    public class PaymentRequestModel
    {
        /// <summary>
        /// Gets or sets the amount.
        /// </summary>
        /// <value>
        /// The amount.
        /// </value>
        public decimal Amount { get; set; }

        /// <summary>
        /// Gets or sets the application identifier.
        /// </summary>
        /// <value>
        /// The application identifier.
        /// </value>
        public int? ApplicationId { get; set; }

        /// <summary>
        /// Gets or sets the con ed transaction identifier.
        /// </summary>
        /// <value>
        /// The con ed transaction identifier.
        /// </value>
        public long? ConEdTransactionId { get; set; }

        /// <summary>
        /// Gets or sets the payment origin.
        /// </summary>
        /// <value>
        /// The payment origin.
        /// </value>
        public PaymentOrigin PaymentOrigin { get; set; }

        /// <summary>
        /// Gets or sets the payment period.
        /// </summary>
        /// <value>
        /// The payment period.
        /// </value>
        public PaymentPeriod PaymentPeriod { get; set; }

        /// <summary>
        /// Gets or sets the person identifier.
        /// </summary>
        /// <value>
        /// The person identifier.
        /// </value>
        public int? PersonId { get; set; }

        /// <summary>
        /// Gets or sets the return URL.
        /// </summary>
        /// <value>
        /// The return URL.
        /// </value>
        public string ReturnUrl { get; set; }

        /// <summary>
        /// Gets or sets the year term.
        /// </summary>
        /// <value>
        /// The year term.
        /// </value>
        public YearTermModel YearTerm { get; set; }
    }

    /// <summary>
    /// PaymentResultViewModel
    /// </summary>
    public class PaymentResultViewModel
    {
        /// <summary>
        /// Gets or sets the amount.
        /// </summary>
        /// <value>
        /// The amount.
        /// </value>
        public string Amount { get; set; }

        /// <summary>
        /// Gets or sets the authorization code.
        /// </summary>
        /// <value>
        /// The authorization code.
        /// </value>
        public string AuthorizationCode { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }
    }

    /// <summary>
    /// PaymentTransactionViewModel
    /// </summary>
    public class PaymentTransactionViewModel
    {
        /// <summary>
        /// Gets or sets the amount.
        /// </summary>
        /// <value>The amount.</value>
        public string Amount { get; set; }

        /// <summary>
        /// Gets or sets the authorization code.
        /// </summary>
        /// <value>The authorization code.</value>
        public string AuthorizationNumber { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the return URL.
        /// </summary>
        /// <value>
        /// The return URL.
        /// </value>
        public string ReturnUrl { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        /// <value>
        /// The status.
        /// </value>
        public int Status { get; set; }

        /// <summary>
        /// Gets or sets the transaction identifier.
        /// </summary>
        /// <value>
        /// The transaction identifier.
        /// </value>
        public int TransactionId { get; set; }
    }
}