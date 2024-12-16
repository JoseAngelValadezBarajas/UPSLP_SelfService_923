// --------------------------------------------------------------------
// <copyright file="CartCreditTypeModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Registration
{
    /// <summary>
    /// CartCreditTypeModel class
    /// </summary>
    public class CartCreditTypeModel
    {
        /// <summary>
        /// Gets or sets the type of the credit.
        /// </summary>
        /// <value>
        /// The type of the credit.
        /// </value>
        public string CreditType { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }
    }
}