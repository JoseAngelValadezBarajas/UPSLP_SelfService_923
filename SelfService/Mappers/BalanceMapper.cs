// --------------------------------------------------------------------
// <copyright file="BalanceMapper.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Finance;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Models.Finances;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SelfService.Mappers
{
    /// <summary>
    /// BalanceMapper
    /// </summary>
    internal static class BalanceMapper
    {
        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="balanceDTO">The account balance dto.</param>
        /// <param name="financialSettings">The financial settings.</param>
        /// <param name="generalSettings">The general settings.</param>
        /// <param name="settingService">The setting service.</param>
        /// <returns>
        /// BalanceByChargesViewModel
        /// </returns>
        internal static BalanceByChargesViewModel ToChargesViewModel(this Balance balanceDTO, InstitutionSettings.Financial financialSettings,
            InstitutionSettings.General generalSettings, ISettingService settingService)
        {
            IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(generalSettings.CurrencyCulture);
            BalanceByChargesViewModel balanceViewModel = new(ToBalanceViewModel(balanceDTO, financialSettings, formatCurrency, settingService));
            if (balanceDTO?.ChargeCreditList?.Count > 0)
            {
                balanceViewModel.Charges = new();
                balanceViewModel.Credits = new();
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(generalSettings.DateTimeCulture);
                foreach (ChargeCredit chargeCreditDTO in balanceDTO.ChargeCreditList)
                {
                    if (chargeCreditDTO.IsCredit && !chargeCreditDTO.IsAnticipated)
                        balanceViewModel.Credits.Add(ToChargeCreditViewModel(chargeCreditDTO, financialSettings, datetimeCulture, formatCurrency));
                    if (!chargeCreditDTO.IsCredit)
                        balanceViewModel.Charges.Add(ToChargeCreditViewModel(chargeCreditDTO, financialSettings, datetimeCulture, formatCurrency));
                }
                if (financialSettings.IncludeAnticipatedAid)
                {
                    balanceViewModel.FinancialAids = new();
                    foreach (ChargeCredit chargeCreditDTO in balanceDTO.ChargeCreditList)
                    {
                        if (chargeCreditDTO.IsAnticipated)
                            balanceViewModel.FinancialAids.Add(ToChargeCreditViewModel(chargeCreditDTO, financialSettings, datetimeCulture, formatCurrency));
                    }
                }
                balanceViewModel.TotalAmountCharges = FormatHelper.ToCurrency((decimal)balanceDTO.ChargeCreditList.Where(x => !x.IsCredit).Sum(x => x.Amount), formatCurrency);
                balanceViewModel.TotalAmountCredits = FormatHelper.ToCurrency((decimal)balanceDTO.ChargeCreditList.Where(x => x.IsCredit && !x.IsAnticipated).Sum(x => x.Amount), formatCurrency);
                balanceViewModel.TotalAmountFinancialAids = FormatHelper.ToCurrency((decimal)balanceDTO.ChargeCreditList.Where(x => x.IsCredit && x.IsAnticipated).Sum(x => x.Amount), formatCurrency);
            }
            return balanceViewModel;
        }

        /// <summary>
        /// To the summary type view model.
        /// </summary>
        /// <param name="balanceDTO">The balance dto.</param>
        /// <param name="financialSettings">The financial settings.</param>
        /// <param name="generalSettings">The general settings.</param>
        /// <param name="settingService">The setting service.</param>
        /// <returns>
        /// BalanceBySummaryTypeViewModel
        /// </returns>
        internal static BalanceBySummaryTypeViewModel ToSummaryTypeViewModel(this Balance balanceDTO, InstitutionSettings.Financial financialSettings,
            InstitutionSettings.General generalSettings, ISettingService settingService)
        {
            IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(generalSettings.CurrencyCulture);
            BalanceBySummaryTypeViewModel balanceBySummaryTypeViewModel = new(ToBalanceViewModel(balanceDTO, financialSettings, formatCurrency, settingService));
            BalanceDetailSummaryTypeViewModel balanceSummaryViewModel = null;
            balanceBySummaryTypeViewModel.DetailSummaryTypes = new();
            if (balanceDTO.SummaryTypes != null)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(generalSettings.DateTimeCulture);
                foreach (BalanceSummary balanceSummaryDTO in balanceDTO.SummaryTypes)
                {
                    balanceSummaryViewModel = new()
                    {
                        Type = balanceSummaryDTO.Type,
                        Description = balanceSummaryDTO.Description,
                        TotalAmount = FormatHelper.ToCurrency(balanceSummaryDTO.Amount, formatCurrency)
                    };
                    balanceSummaryViewModel.Charges = new();
                    List<ChargeCredit> charges = null;
                    if (balanceDTO.ChargeCreditList != null)
                    {
                        charges = balanceDTO.ChargeCreditList.Where(x => x.SummaryType == balanceSummaryDTO.Type).ToList();
                        foreach (ChargeCredit chargeCreditDTO in charges)
                            balanceSummaryViewModel.Charges.Add(ToChargeCreditViewModel(chargeCreditDTO, financialSettings, datetimeCulture, formatCurrency));
                    }
                    balanceBySummaryTypeViewModel.DetailSummaryTypes.Add(balanceSummaryViewModel);
                }
            }
            return balanceBySummaryTypeViewModel;
        }

        /// <summary>
        /// To the summary view model.
        /// </summary>
        /// <param name="balanceDTO">The balance dto.</param>
        /// <param name="financialSettings">The financial settings.</param>
        /// <param name="generalSettings">The general settings.</param>
        /// <param name="settingService">The setting service.</param>
        /// <returns>
        /// BalanceBySummaryViewModel
        /// </returns>
        internal static BalanceBySummaryViewModel ToSummaryViewModel(this Balance balanceDTO, InstitutionSettings.Financial financialSettings,
            InstitutionSettings.General generalSettings, ISettingService settingService)
        {
            IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(generalSettings.CurrencyCulture);
            BalanceBySummaryViewModel summaryViewModel = new(ToBalanceViewModel(balanceDTO, financialSettings, formatCurrency, settingService))
            {
                SummaryTypes = new()
            };
            if (balanceDTO.SummaryTypes?.Count > 0)
            {
                foreach (BalanceSummary summary in balanceDTO.SummaryTypes)
                {
                    summaryViewModel.SummaryTypes.Add(new()
                    {
                        Description = summary.Description,
                        Amount = FormatHelper.ToCurrency(summary.Amount, formatCurrency)
                    });
                }
            }
            return summaryViewModel;
        }

        #region Private Methods

        /// <summary>
        /// To the balance view model.
        /// </summary>
        /// <param name="balanceDTO">The balance dto.</param>
        /// <param name="financialSettings">The financial settings.</param>
        /// <param name="formatCurrency">The format currency.</param>
        /// <param name="settingService">The setting service.</param>
        /// <returns>
        /// BalanceViewModel
        /// </returns>
        private static BalanceViewModel ToBalanceViewModel(Balance balanceDTO, InstitutionSettings.Financial financialSettings,
              IFormatProvider formatCurrency, ISettingService settingService)
        {
            return new BalanceViewModel
            {
                PeriodSummaryTotal = FormatHelper.ToCurrency(balanceDTO.SummaryTypeTotal, formatCurrency),
                PeriodAnticipatedFinAid = FormatHelper.ToCurrency(balanceDTO.AnticipatedAidPeriodTotal, formatCurrency),
                PeriodTotal = FormatHelper.ToCurrency(balanceDTO.SummaryTypeTotal - balanceDTO.AnticipatedAidPeriodTotal, formatCurrency),
                OtherPeriodsBalance = FormatHelper.ToCurrency(balanceDTO.OtherPeriodsTotal, formatCurrency),
                OtherPeriodsBalanceDue = FormatHelper.ToCurrency(balanceDTO.OverallTotal, formatCurrency),
                OtherPeriodsAnticipatedFinAid = FormatHelper.ToCurrency(balanceDTO.AnticipatedAidTotal - balanceDTO.AnticipatedAidPeriodTotal, formatCurrency),
                OtherPeriodsAnticipatedBalance = FormatHelper.ToCurrency(balanceDTO.AnticipatedBalance, formatCurrency),
                DisplayDueDate = financialSettings.DisplayDueDate,
                DisplayEstimatedLateFees = settingService.IsApplicationOfPaymentEnabled(),
                IncludeAnticipatedAid = financialSettings.IncludeAnticipatedAid
            };
        }

        /// <summary>
        /// To the charge credit view model.
        /// </summary>
        /// <param name="chargeCreditDTO">The charge credit dto.</param>
        /// <param name="financialSettings">The financial settings.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <param name="formatCurrency">The format currency.</param>
        /// <returns>
        /// ChargeCreditViewModel
        /// </returns>
        private static ChargeCreditViewModel ToChargeCreditViewModel(ChargeCredit chargeCreditDTO, InstitutionSettings.Financial financialSettings,
            CultureInfo datetimeCulture, IFormatProvider formatCurrency)
        {
            return new ChargeCreditViewModel
            {
                EntryDate = FormatHelper.ToShortDate(chargeCreditDTO.EntryDate, datetimeCulture),
                Period = string.IsNullOrEmpty(chargeCreditDTO.SessionDesc) ?
                            chargeCreditDTO.Year + "/" + chargeCreditDTO.TermDesc : chargeCreditDTO.Year + "/" + chargeCreditDTO.TermDesc + "/" + chargeCreditDTO.SessionDesc,
                Description = chargeCreditDTO.Description,
                DueDate = financialSettings.DisplayDueDate ? FormatHelper.ToShortDate(chargeCreditDTO.DueDate, datetimeCulture) : string.Empty,
                Amount = FormatHelper.ToCurrency((decimal)chargeCreditDTO.Amount, formatCurrency),
                EstimatedLateFeeAmount = FormatHelper.ToCurrency(chargeCreditDTO.EstimatedLateFeeAmount, formatCurrency),
                Type = chargeCreditDTO.Type
            };
        }

        #endregion Private Methods
    }
}