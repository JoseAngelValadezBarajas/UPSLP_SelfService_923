// --------------------------------------------------------------------
// <copyright file="StatementMapper.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Finance;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.Statement;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SelfService.Mappers
{
    /// <summary>
    /// StatementMapper
    /// </summary>
    internal static class StatementMapper
    {
        /// <summary>
        /// Maps DTO.Statement To StatementViewModel.
        /// </summary>
        /// <param name="statementDTO">The statement dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns>
        /// StatementViewModel
        /// </returns>
        internal static StatementViewModel ToViewModel(this Statement statementDTO, string nameFormat, InstitutionSettings.General general, bool showMiddleNameInitial)
        {
            StatementViewModel statementViewModel = null;
            if (statementDTO != null)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
                statementViewModel = new StatementViewModel()
                {
                    AnticipatedMessage = statementDTO.AnticipatedMessage,
                    BalanceTypeDesc = statementDTO.BalanceTypeDesc,
                    CreditCardTypes = statementDTO.CreditCardTypes,
                    CurrentBalance = FormatHelper.ToCurrency(statementDTO.CurrentBalance, formatCurrency),
                    Date = FormatHelper.ToLongDate(statementDTO.Date, datetimeCulture),
                    Description = statementDTO.Description,
                    DueDate = FormatHelper.ToShortDate(statementDTO.DueDate, datetimeCulture),
                    GeneralMessage = statementDTO.GeneralMessage,
                    LessAnticipatedCredits = FormatHelper.ToCurrency(statementDTO.LessAnticipatedCredits, formatCurrency),
                    Number = statementDTO.Number,
                    PaymentDue = FormatHelper.ToCurrency(statementDTO.PaymentDue, formatCurrency),
                    PayplanFlag = statementDTO.PayplanFlag,
                    PosNegMessage = statementDTO.PosNegMessage,
                    PreviousBalance = FormatHelper.ToCurrency(statementDTO.PreviousBalance, formatCurrency),
                    Title = statementDTO.Title,
                    Type = statementDTO.Type,
                };

                if (statementDTO.PayplanFlag == "Y")
                {
                    statementViewModel.OtherAmountDue = FormatHelper.ToCurrency(statementDTO.CurrentBalance - statementDTO.TotalAnticipated - statementDTO.PayplanBalance, formatCurrency);
                    statementViewModel.OtherAmountDueHasValue = (statementDTO.CurrentBalance - statementDTO.TotalAnticipated - statementDTO.PayplanBalance) > 0;
                }
                else
                {
                    statementViewModel.OtherAmountDueHasValue = false;
                }

                if (statementDTO.Type == "P")
                {
                    statementViewModel.InstallmentDue = FormatHelper.ToCurrency(statementDTO.PaymentOptionInstallment, formatCurrency);
                }
                else
                {
                    statementViewModel.InstallmentDue = statementDTO.PayplanFlag == "Y"
                        ? FormatHelper.ToCurrency(statementDTO.PaymentDue - (statementDTO.CurrentBalance - statementDTO.TotalAnticipated - statementDTO.PayplanBalance), formatCurrency)
                        : FormatHelper.ToCurrency(statementDTO.TotalAnticipated, formatCurrency);
                }

                statementViewModel.ShowPreviousBalance = statementDTO.BalanceType == "ALLTERMCUM" || statementDTO.BalanceType == "TERMCUM" || statementDTO.BalanceType == "ACAYR";

                if (statementDTO.ChargeCredits != null)
                {
                    StatementChargeCreditViewModel chargeCreditViewModel = null;
                    statementViewModel.Charges = new List<StatementChargeCreditViewModel>();
                    statementViewModel.Credits = new List<StatementChargeCreditViewModel>();
                    statementViewModel.AnticipatedAids = new List<StatementChargeCreditViewModel>();
                    statementViewModel.PaymentPlanCharges = new List<StatementChargeCreditViewModel>();
                    bool includeAnticipated = statementDTO.ChargeCredits?.Where(x => x.IsAnticipated).Sum(x => x.Amount) > 0;
                    foreach (StatementChargeCredit statementChargeCreditDTO in statementDTO.ChargeCredits)
                    {
                        chargeCreditViewModel = new StatementChargeCreditViewModel
                        {
                            Amount = statementChargeCreditDTO.LineType == "PP" ? FormatHelper.ToCurrency(statementChargeCreditDTO.SchedulePaymentAmount, formatCurrency) :
                                FormatHelper.ToCurrency(statementChargeCreditDTO.Amount ?? 0, formatCurrency),
                            Description = statementChargeCreditDTO.Description,
                            StatementMessage = statementChargeCreditDTO.StatementMessage,
                            DueDate = FormatHelper.ToShortDate(statementChargeCreditDTO.DueDate, datetimeCulture),
                            EntryDate = FormatHelper.ToShortDate(statementChargeCreditDTO.EntryDate, datetimeCulture),
                            Period = string.IsNullOrEmpty(statementChargeCreditDTO.SessionDesc) ?
                                    $"{statementChargeCreditDTO.Year}/{statementChargeCreditDTO.TermDesc}" :
                                    $"{statementChargeCreditDTO.Year}/{statementChargeCreditDTO.TermDesc}/{statementChargeCreditDTO.SessionDesc}",
                            Type = statementChargeCreditDTO.Type,
                            LineType = statementChargeCreditDTO.LineType
                        };

                        if (statementChargeCreditDTO.LineType == "PP" && statementChargeCreditDTO.GroupType == "P")
                            statementViewModel.PaymentPlanCharges.Add(chargeCreditViewModel);
                        if (statementChargeCreditDTO.IsCredit)
                            statementViewModel.Credits.Add(chargeCreditViewModel);
                        if (!statementChargeCreditDTO.IsCredit && statementChargeCreditDTO.LineType == "CC" && !statementChargeCreditDTO.IsAnticipated)
                            statementViewModel.Charges.Add(chargeCreditViewModel);
                        if (statementChargeCreditDTO.IsAnticipated && includeAnticipated)
                            statementViewModel.AnticipatedAids.Add(chargeCreditViewModel);
                    }
                    statementViewModel.TotalCharges = FormatHelper.ToCurrency((decimal)statementDTO.ChargeCredits.Where(x => !x.IsCredit && x.GroupType != "F").Sum(x => x.Amount), formatCurrency);
                    statementViewModel.TotalChargesHasValue = statementDTO.ChargeCredits.Where(x => !x.IsCredit && x.GroupType != "F").Sum(x => x.Amount) > 0;
                    statementViewModel.TotalCredits = FormatHelper.ToCurrency((decimal)statementDTO.ChargeCredits.Where(x => x.IsCredit).Sum(x => x.Amount), formatCurrency);
                    statementViewModel.TotalCreditsHasValue = statementDTO.ChargeCredits.Where(x => x.IsCredit).Sum(x => x.Amount) > 0;
                    statementViewModel.TotalAnticipatedAid = FormatHelper.ToCurrency((decimal)statementDTO.ChargeCredits.Where(x => x.IsAnticipated).Sum(x => x.Amount), formatCurrency);
                    statementViewModel.TotalAnticipatedAidHasValue = statementDTO.ChargeCredits.Where(x => x.IsAnticipated).Sum(x => x.Amount) > 0;
                }

                statementViewModel.Organization = new OrganizationViewModel
                {
                    Name = statementDTO.Organization.Name,
                    Address = ToAddressViewModel(statementDTO.Organization.Address)
                };

                statementViewModel.Student = new PeopleViewModel
                {
                    FullName = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(FormatHelper.SetNamePart(statementDTO.Student)), nameFormat, showMiddleNameInitial),
                    PeopleId = FormatHelper.ToPeopleId(statementDTO.Student.PeopleId, general.PeopleIdFormat),
                    Address = ToAddressViewModel(statementDTO.Student.Address)
                };

                statementViewModel.MailTo = new PeopleViewModel
                {
                    FullName = statementDTO.MailTo.AddressLine1,
                    Address = ToAddressViewModel(statementDTO.MailTo)
                };
                statementViewModel.MailTo.Address.Line1 = statementDTO.MailTo.AddLine1;
                statementViewModel.MailTo.Address.Line2 = statementDTO.MailTo.AddLine2;
                statementViewModel.MailTo.Address.Line3 = statementDTO.MailTo.AddLine3;
                statementViewModel.MailTo.Address.Line4 = statementDTO.MailTo.AddLine4;
            }
            return statementViewModel;
        }

        /// <summary>
        /// To the address view model.
        /// </summary>
        /// <param name="address">The address.</param>
        /// <returns>
        /// AddressViewModel
        /// </returns>
        private static AddressViewModel ToAddressViewModel(Address address)
        {
            return new AddressViewModel
            {
                HouseNumber = address.HouseNumber,
                Line1 = address.AddressLine1,
                Line2 = address.AddressLine2,
                Line3 = address.AddressLine3,
                Line4 = address.AddressLine4,
                Line5 = (!string.IsNullOrEmpty(address.CityPrefix) || !string.IsNullOrEmpty(address.City) || !string.IsNullOrEmpty(address.CitySuffix))
                        && (!string.IsNullOrEmpty(address.State) || !string.IsNullOrEmpty(address.ZipCode)) ?
                    $"{address.CityPrefix} {address.City} {address.CitySuffix}, {address.State} {address.ZipCode}"
                    : $"{address.CityPrefix} {address.City} {address.CitySuffix} {address.State} {address.ZipCode}"
            };
        }
    }
}