// --------------------------------------------------------------------
// <copyright file="PaymentTransactionMapper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.Payment;
using System;

namespace SelfService.Mappers
{
    /// <summary>
    /// PaymentTransactionMapper
    /// </summary>
    internal static class PaymentTransactionMapper
    {
        /// <summary>
        /// Converts FormLayout To AppSetupFormViewModel
        /// </summary>
        /// <param name="paymentTransactionDTO">The payment transaction dto.</param>
        /// <param name="currencyCultureFormat">The currency culture format.</param>
        /// <returns></returns>
        internal static PaymentTransactionViewModel ToViewModel(this PaymentTransactionDetail paymentTransactionDTO, string currencyCultureFormat)
        {
            PaymentTransactionViewModel paymentTranscationViewModel = null;
            if (paymentTransactionDTO != null)
            {
                IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(currencyCultureFormat);
                paymentTranscationViewModel = new PaymentTransactionViewModel
                {
                    Amount = FormatHelper.ToCurrency(paymentTransactionDTO.Amount, formatCurrency),
                    AuthorizationNumber = paymentTransactionDTO.AuthorizationNumber,
                    Description = paymentTransactionDTO.Description,
                    ReturnUrl = string.Empty,
                    TransactionId = paymentTransactionDTO.TransactionId,
                    Status = paymentTransactionDTO.IsSuccessful ? 1 : 0
                };
            }
            return paymentTranscationViewModel;
        }
    }
}