// --------------------------------------------------------------------
// <copyright file="StatementViewModel.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Statement
{
    /// <summary>
    /// AddressViewModel
    /// </summary>
    public class AddressViewModel
    {
        /// <summary>
        /// Gets or sets the house number.
        /// </summary>
        /// <value>
        /// The house number.
        /// </value>
        public string HouseNumber { get; set; }

        /// <summary>
        /// Gets or sets the line1.
        /// </summary>
        /// <value>
        /// The line1.
        /// </value>
        public string Line1 { get; set; }

        /// <summary>
        /// Gets or sets the line2.
        /// </summary>
        /// <value>
        /// The line2.
        /// </value>
        public string Line2 { get; set; }

        /// <summary>
        /// Gets or sets the line3.
        /// </summary>
        /// <value>
        /// The line3.
        /// </value>
        public string Line3 { get; set; }

        /// <summary>
        /// Gets or sets the line4.
        /// </summary>
        /// <value>
        /// The line4.
        /// </value>
        public string Line4 { get; set; }

        /// <summary>
        /// Gets or sets the line5.
        /// </summary>
        /// <value>
        /// The line5.
        /// </value>
        public string Line5 { get; set; }
    }

    /// <summary>
    /// OrganizationViewModel
    /// </summary>
    public class OrganizationViewModel
    {
        /// <summary>
        /// Gets or sets the address.
        /// </summary>
        /// <value>
        /// The address.
        /// </value>
        public AddressViewModel Address { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }
    }

    /// <summary>
    /// PeopleViewModel
    /// </summary>
    public class PeopleViewModel
    {
        /// <summary>
        /// Gets or sets the address.
        /// </summary>
        /// <value>
        /// The address.
        /// </value>
        public AddressViewModel Address { get; set; }

        /// <summary>
        /// Gets or sets the full name.
        /// </summary>
        /// <value>
        /// The full name.
        /// </value>
        public string FullName { get; set; }

        /// <summary>
        /// Gets or sets the people identifier.
        /// </summary>
        /// <value>
        /// The people identifier.
        /// </value>
        public string PeopleId { get; set; }
    }

    /// <summary>
    /// StatementViewModel
    /// </summary>
    public class StatementViewModel
    {
        /// <summary>
        /// Gets or sets the anticipated aids.
        /// </summary>
        /// <value>
        /// The anticipated aids.
        /// </value>
        public List<StatementChargeCreditViewModel> AnticipatedAids { get; set; }

        /// <summary>
        /// Gets or sets the anticipated message.
        /// </summary>
        /// <value>
        /// The anticipated message.
        /// </value>
        public string AnticipatedMessage { get; set; }

        /// <summary>
        /// Gets or sets the balance type desc.
        /// </summary>
        /// <value>
        /// The balance type desc.
        /// </value>
        public string BalanceTypeDesc { get; set; }

        /// <summary>
        /// Gets or sets the charges.
        /// </summary>
        /// <value>
        /// The charges.
        /// </value>
        public List<StatementChargeCreditViewModel> Charges { get; set; }

        /// <summary>
        /// Gets or sets the credit card types.
        /// </summary>
        /// <value>
        /// The credit card types.
        /// </value>
        public string CreditCardTypes { get; set; }

        /// <summary>
        /// Gets or sets the credits.
        /// </summary>
        /// <value>
        /// The credits.
        /// </value>
        public List<StatementChargeCreditViewModel> Credits { get; set; }

        /// <summary>
        /// Gets or sets the current balance.
        /// </summary>
        /// <value>
        /// The current balance.
        /// </value>
        public string CurrentBalance { get; set; }

        /// <summary>
        /// Gets or sets the Statement date.
        /// </summary>
        /// <value>
        /// The date.
        /// </value>
        public string Date { get; set; }

        /// <summary>
        /// Gets or sets the Statement description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the Statement due date.
        /// </summary>
        /// <value>
        /// The due date.
        /// </value>
        public string DueDate { get; set; }

        /// <summary>
        /// Gets or sets the general message.
        /// </summary>
        /// <value>
        /// The general message.
        /// </value>
        public string GeneralMessage { get; set; }

        /// <summary>
        /// Gets or sets the installment due.
        /// </summary>
        /// <value>
        /// The installment due.
        /// </value>
        public string InstallmentDue { get; set; }

        /// <summary>
        /// Gets or sets the less anticipated credits.
        /// </summary>
        /// <value>
        /// The less anticipated credits.
        /// </value>
        public string LessAnticipatedCredits { get; set; }

        /// <summary>
        /// Gets or sets the mail to.
        /// </summary>
        /// <value>
        /// The mail to.
        /// </value>
        public PeopleViewModel MailTo { get; set; }

        /// <summary>
        /// Gets or sets the Statement number.
        /// </summary>
        /// <value>
        /// The number.
        /// </value>
        public int Number { get; set; }

        /// <summary>
        /// Gets or sets the organization.
        /// </summary>
        /// <value>
        /// The organization.
        /// </value>
        public OrganizationViewModel Organization { get; set; }

        /// <summary>
        /// Gets or sets the other amount due.
        /// </summary>
        /// <value>
        /// The other amount due.
        /// </value>
        public string OtherAmountDue { get; set; }

        /// <summary>
        /// Gets the other amount due value.
        /// </summary>
        /// <value>
        /// The other amount due value.
        /// </value>
        public bool OtherAmountDueHasValue { get; set; }

        /// <summary>
        /// Gets or sets the Statement payment due.
        /// </summary>
        /// <value>
        /// The payment due.
        /// </value>
        public string PaymentDue { get; set; }

        /// <summary>
        /// Gets or sets the payment plan charges.
        /// </summary>
        /// <value>
        /// The payment plan charges.
        /// </value>
        public List<StatementChargeCreditViewModel> PaymentPlanCharges { get; set; }

        /// <summary>
        /// Gets or sets the payplan flag.
        /// </summary>
        /// <value>
        /// The payplan flag.
        /// </value>
        public string PayplanFlag { get; set; }

        /// <summary>
        /// Gets or sets the Statement message.
        /// </summary>
        /// <value>
        /// The position neg message.
        /// </value>
        public string PosNegMessage { get; set; }

        /// <summary>
        /// Gets or sets previous balance.
        /// </summary>
        /// <value>
        /// The previous balance.
        /// </value>
        public string PreviousBalance { get; set; }

        /// <summary>
        /// Gets or sets show previous balance.
        /// </summary>
        /// <value>
        /// The show previous balance.
        /// </value>
        public bool ShowPreviousBalance { get; set; }

        /// <summary>
        /// Gets or sets the student information
        /// </summary>
        /// <value>
        /// The student.
        /// </value>
        public PeopleViewModel Student { get; set; }

        /// <summary>
        /// Gets or sets the Statement title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the total anticipated aid.
        /// </summary>
        /// <value>
        /// The total anticipated aid.
        /// </value>
        public string TotalAnticipatedAid { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [total anticipated aid has value].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [total anticipated aid has value]; otherwise, <c>false</c>.
        /// </value>
        public bool TotalAnticipatedAidHasValue { get; set; }

        /// <summary>
        /// Gets or sets the total charges.
        /// </summary>
        /// <value>
        /// The total charges.
        /// </value>
        public string TotalCharges { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [total charges has value].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [total charges has value]; otherwise, <c>false</c>.
        /// </value>
        public bool TotalChargesHasValue { get; set; }

        /// <summary>
        /// Gets or sets the total credits.
        /// </summary>
        /// <value>
        /// The total credits.
        /// </value>
        public string TotalCredits { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [total credits has value].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [total credits has value]; otherwise, <c>false</c>.
        /// </value>
        public bool TotalCreditsHasValue { get; set; }

        /// <summary>
        /// Gets or sets the type:  T = Total, P = Plan
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        public string Type { get; set; }
    }
}