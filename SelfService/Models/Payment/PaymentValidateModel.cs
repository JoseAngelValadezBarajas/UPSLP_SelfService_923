// --------------------------------------------------------------------
// <copyright file="PaymentValidateModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;

namespace SelfService.Models.Payment
{
    /// <summary>
    /// PaymentValidateModel class
    /// </summary>
    public class PaymentValidateModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether [from payment].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [from payment]; otherwise, <c>false</c>.
        /// </value>
        public bool FromPayment { get; set; }

        /// <summary>
        /// Gets or sets the payment origin.
        /// </summary>
        /// <value>
        /// The payment origin.
        /// </value>
        public PaymentOrigin PaymentOrigin { get; set; }
    }
}