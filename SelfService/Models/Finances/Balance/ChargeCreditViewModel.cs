// --------------------------------------------------------------------
// <copyright file="ChargeCreditViewModel.cs" company="Ellucian">
//     Copyright 2018 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Finances
{
    /// <summary>
    /// BaseChargeCreditViewModel
    /// </summary>
    public class BaseChargeCreditViewModel
    {
        /// <summary>
        /// Gets or sets the amount.
        /// </summary>
        /// <value>
        /// The amount.
        /// </value>
        public string Amount { get; set; }

        /// <summary>
        /// Gets or sets the amount value.
        /// </summary>
        /// <value>
        /// The amount value.
        /// </value>
        public decimal AmountValue { get; set; }

        /// <summary>
        /// Gets or sets the code.
        /// </summary>
        /// <value>
        /// The code.
        /// </value>
        public int Code { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is credit.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is credit; otherwise, <c>false</c>.
        /// </value>
        public bool IsCredit { get; set; }
    }

    /// <summary>
    /// ChargeCreditViewModel
    /// </summary>
    public class ChargeCreditViewModel : BaseChargeCreditViewModel
    {
        /// <summary>
        /// Gets or sets the due date.
        /// </summary>
        /// <value>
        /// The due date.
        /// </value>
        public string DueDate { get; set; }

        /// <summary>
        /// Gets or sets the entry date.
        /// </summary>
        /// <value>
        /// The entry date.
        /// </value>
        public string EntryDate { get; set; }

        /// <summary>
        /// Gets or sets the estimated late fee amount.
        /// </summary>
        /// <value>
        /// The estimated late fee amount.
        /// </value>
        public string EstimatedLateFeeAmount { get; set; }

        /// <summary>
        /// Gets or sets the period.
        /// </summary>
        /// <value>
        /// The period.
        /// </value>
        public string Period { get; set; }

        /// <summary>
        /// Gets or sets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        public string Type { get; set; }
    }

    /// <summary>
    /// DiscountChargeCreditViewModel
    /// </summary>
    public class DiscountChargeCreditViewModel : BaseChargeCreditViewModel
    {
        /// <summary>
        /// Gets the academic session.
        /// </summary>
        /// <value>
        /// The academic session.
        /// </value>
        public string AcademicSession { get; set; }

        /// <summary>
        /// Gets the academic term.
        /// </summary>
        /// <value>
        /// The academic term.
        /// </value>
        public string AcademicTerm { get; set; }

        /// <summary>
        /// Gets the academic year.
        /// </summary>
        /// <value>
        /// The academic year.
        /// </value>
        public string AcademicYear { get; set; }

        /// <summary>
        /// Gets or sets the discount amount.
        /// </summary>
        /// <value>
        /// The discount amount.
        /// </value>
        public string DiscountAmount { get; set; }

        /// <summary>
        /// Gets or sets the discount amount value.
        /// </summary>
        /// <value>
        /// The discount amount value.
        /// </value>
        public decimal DiscountAmountValue { get; set; }

        /// <summary>
        /// Gets or sets the discount code.
        /// </summary>
        /// <value>
        /// The discount code.
        /// </value>
        public string DiscountCode { get; set; }

        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public string EventId { get; set; }

        /// <summary>
        /// Gets or sets the name of the event.
        /// </summary>
        /// <value>
        /// The name of the event.
        /// </value>
        public string EventName { get; set; }

        /// <summary>
        /// Gets a value indicating whether this instance is other.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is other; otherwise, <c>false</c>.
        /// </value>
        public bool IsOther { get; internal set; }

        /// <summary>
        /// Gets or sets the section identifier.
        /// </summary>
        /// <value>
        /// The section identifier.
        /// </value>
        public int SectionId { get; set; }
    }
}