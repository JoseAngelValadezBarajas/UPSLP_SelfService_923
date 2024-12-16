// --------------------------------------------------------------------
// <copyright file="FinancialAidMapper.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.FinancialAid;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Models.Finances.FinancialAid;
using SelfService.Models.Resources;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SelfService.Mappers
{
    /// <summary>
    /// Financial Aid Mapper
    /// </summary>
    internal static class FinancialAidMapper
    {
        /// <summary>
        /// Map FinancialAid to FinancialAidViewModel
        /// </summary>
        /// <param name="financialAidDTO">The financial aid dto.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="institutionSettings">The institution settings.</param>
        /// <returns></returns>
        internal static FinancialAidViewModel ToViewModel(this FinancialAidDetail financialAidDTO, FinancialAidResources resources, IInstitutionSettingService institutionSettings)
        {
            InstitutionSettings.General generalSettings = institutionSettings.GetGeneral();
            FinancialAidViewModel financialAidViewModel = new();
            if (financialAidDTO != null)
            {
                financialAidViewModel.DisplayUnmetNeed = institutionSettings.GetFinancial().FinAidDisplayUnmetNeeds;
                IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(generalSettings.CurrencyCulture);
                if (financialAidDTO.Documents?.Count > 0)
                {
                    CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(generalSettings.DateTimeCulture);
                    financialAidViewModel.Documents = new List<FinAidDocumentViewModel>();
                    foreach (FinAidDocument documentDTO in financialAidDTO.Documents)
                    {
                        financialAidViewModel.Documents.Add(new FinAidDocumentViewModel
                        {
                            DocName = documentDTO.DocName,
                            DocStatusDescription = documentDTO.DocStatusDescription,
                            StatusEffectiveDate = FormatHelper.ToShortDate(documentDTO.StatusEffectiveDateTime, datetimeCulture)
                        });
                    }
                }
                if (financialAidDTO.Packagings?.Count > 0)
                {
                    financialAidViewModel.Packaging = new List<FinAidPackagingViewModel>
                    {
                        new FinAidPackagingViewModel
                        {
                            StudentBudget =  CreateStudentBudget(financialAidDTO.Packagings[0], resources, generalSettings),
                            StudentFinancialAid = CreateStudentFinAid(financialAidDTO.Packagings[0], resources, generalSettings),
                            StudentNeed = CreateStudentNeed(financialAidDTO.Packagings[0], resources, financialAidViewModel.DisplayUnmetNeed, generalSettings)
                        }
                    };
                }
                if (financialAidDTO.Loans?.Count > 0)
                {
                    CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(generalSettings.DateTimeCulture);
                    financialAidViewModel.Loans = new List<FinAidLoanViewModel>();
                    foreach (FinAidLoan item in financialAidDTO.Loans)
                    {
                        financialAidViewModel.Loans.Add(new FinAidLoanViewModel
                        {
                            ApplicationReceived = FormatHelper.ToShortDate(item.ApplicationReceivedDate, datetimeCulture),
                            InterestRate = item.InterestRate.ToString(),
                            LenderApprovedDate = FormatHelper.ToShortDate(item.LenderApprovedDate, datetimeCulture),
                            LenderName = item.LenderName,
                            LoanIdentifier = item.LoanIdentifier,
                            LoanRequested = FormatHelper.ToCurrency(item.LoanRequestedAmount, formatCurrency),
                            PeriodBeginDate = FormatHelper.ToShortDate(item.LoanPeriodBeginDate, datetimeCulture),
                            PeriodEndDate = FormatHelper.ToShortDate(item.LoanPeriodEndDate, datetimeCulture),
                            SignatureDate = FormatHelper.ToShortDate(item.BorrowerSignatureDate, datetimeCulture),
                            Status = item.Status
                        });
                    }
                }
                if (financialAidDTO.EnrollmentPeriods?.Count > 0)
                {
                    financialAidViewModel.AwardTerms = new List<FinAidAwardTermViewModel>();
                    FinAidAwardTermViewModel award = null;
                    foreach (FinAidPoe item in financialAidDTO.EnrollmentPeriods)
                    {
                        award = new FinAidAwardTermViewModel
                        {
                            AwardTermDescription = item.DisplayName,
                            Funds = GetFunds(item.PoeToken, financialAidDTO.AcademicTermAwards, formatCurrency),
                            TotalActualAmountByTerm = GetTotalActualAmountByTerm(item.PoeToken, financialAidDTO.AcademicTermAwards, formatCurrency),
                            TotalScheduledAmountByTerm = GetTotalScheduledAmountByTerm(item.PoeToken, financialAidDTO.AcademicTermAwards, formatCurrency)
                        };
                        financialAidViewModel.AwardTerms.Add(award);
                    }
                }
                if (financialAidDTO.Messages?.Count > 0)
                    financialAidViewModel.Messages = financialAidDTO.Messages;
            }
            return financialAidViewModel;
        }

        #region Private Methods

        /// <summary>
        /// Creates the student budget.
        /// </summary>
        /// <param name="finAidPackaging">The fin aid packaging.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="general">The general.</param>
        /// <returns>
        /// FinAidCategoryViewModel List
        /// </returns>
        private static List<FinAidCategoryViewModel> CreateStudentBudget(FinAidPackaging finAidPackaging, FinancialAidResources resources,
            InstitutionSettings.General general)
        {
            IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
            List<FinAidCategoryViewModel> studentBudget = new();
            if (finAidPackaging.TotalTuitionFees > 0)
            {
                studentBudget.Add(new FinAidCategoryViewModel
                {
                    Category = resources.LblTuitionFees,
                    Amount = FormatHelper.ToCurrency(finAidPackaging.TotalTuitionFees, formatCurrency)
                });
            }

            if (finAidPackaging.TotalRoomBoard > 0)
            {
                studentBudget.Add(new FinAidCategoryViewModel
                {
                    Category = resources.LblRoomBoard,
                    Amount = FormatHelper.ToCurrency(finAidPackaging.TotalRoomBoard, formatCurrency)
                });
            }

            if (finAidPackaging.TotalBooksSupplies > 0)
            {
                studentBudget.Add(new FinAidCategoryViewModel
                {
                    Category = resources.LblBooksSupplies,
                    Amount = FormatHelper.ToCurrency(finAidPackaging.TotalBooksSupplies, formatCurrency)
                });
            }

            if (finAidPackaging.TotalDependentCare > 0)
            {
                studentBudget.Add(new FinAidCategoryViewModel
                {
                    Category = resources.LblDependentCare,
                    Amount = FormatHelper.ToCurrency(finAidPackaging.TotalDependentCare, formatCurrency)
                });
            }

            if (finAidPackaging.TotalDisability > 0)
            {
                studentBudget.Add(new FinAidCategoryViewModel
                {
                    Category = resources.LblDisability,
                    Amount = FormatHelper.ToCurrency(finAidPackaging.TotalDisability, formatCurrency)
                });
            }

            if (finAidPackaging.TotalStudyAbroad > 0)
            {
                studentBudget.Add(new FinAidCategoryViewModel
                {
                    Category = resources.LblStudyAbroad,
                    Amount = FormatHelper.ToCurrency(finAidPackaging.TotalStudyAbroad, formatCurrency)
                });
            }

            if (finAidPackaging.TotalCooperativeEducation > 0)
            {
                studentBudget.Add(new FinAidCategoryViewModel
                {
                    Category = resources.LblCooperativeEducation,
                    Amount = FormatHelper.ToCurrency(finAidPackaging.TotalCooperativeEducation, formatCurrency)
                });
            }

            if (finAidPackaging.TotalTransportation > 0)
            {
                studentBudget.Add(new FinAidCategoryViewModel
                {
                    Category = resources.LblTransportation,
                    Amount = FormatHelper.ToCurrency(finAidPackaging.TotalTransportation, formatCurrency)
                });
            }

            if (finAidPackaging.TotalOtherBudget > 0)
            {
                studentBudget.Add(new FinAidCategoryViewModel
                {
                    Category = resources.LblOther,
                    Amount = FormatHelper.ToCurrency(finAidPackaging.TotalOtherBudget, formatCurrency)
                });
            }

            return studentBudget;
        }

        /// <summary>
        /// Creates the student fin aid.
        /// </summary>
        /// <param name="finAidPackaging">The fin aid packaging.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="general">The general.</param>
        /// <returns>
        /// FinAidCategoryViewModel List
        /// </returns>
        private static List<FinAidCategoryViewModel> CreateStudentFinAid(FinAidPackaging finAidPackaging, FinancialAidResources resources, InstitutionSettings.General general)
        {
            IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
            List<FinAidCategoryViewModel> finAidBudget = new();
            if (finAidPackaging.TotalGrantsAward > 0)
                finAidBudget.Add(new FinAidCategoryViewModel { Category = resources.LblScholarshipGrant, Amount = FormatHelper.ToCurrency(finAidPackaging.TotalGrantsAward, formatCurrency) });
            if (finAidPackaging.TotalLoansAward > 0)
                finAidBudget.Add(new FinAidCategoryViewModel { Category = resources.LblLoans, Amount = FormatHelper.ToCurrency(finAidPackaging.TotalLoansAward, formatCurrency) });
            if (finAidPackaging.TotalJobsWorkStudyAward > 0)
                finAidBudget.Add(new FinAidCategoryViewModel { Category = resources.LblJobs, Amount = FormatHelper.ToCurrency(finAidPackaging.TotalJobsWorkStudyAward, formatCurrency) });
            if (finAidPackaging.TotalPackageAward > 0)
                finAidBudget.Add(new FinAidCategoryViewModel { Category = resources.LblTotalPackageAward, Amount = FormatHelper.ToCurrency(finAidPackaging.TotalPackageAward, formatCurrency) });
            return finAidBudget;
        }

        /// <summary>
        /// Creates the student need package
        /// </summary>
        /// <param name="finAidPackaging">The fin aid packaging.</param>
        /// <param name="resources">The resources.</param>
        /// <param name="displayUnmetNeed">if set to <c>true</c> [display unmet need].</param>
        /// <param name="general">The general.</param>
        /// <returns>
        /// FinAidCategoryViewModel List
        /// </returns>
        private static List<FinAidCategoryViewModel> CreateStudentNeed(FinAidPackaging finAidPackaging, FinancialAidResources resources, bool displayUnmetNeed,
            InstitutionSettings.General general)
        {
            IFormatProvider formatCurrency = FormatHelper.GetCustomCurrencyFormat(general.CurrencyCulture);
            List<FinAidCategoryViewModel> studentNeeds = new()
            {
                new FinAidCategoryViewModel { Category = resources.LblTotalBudget, Amount = FormatHelper.ToCurrency(finAidPackaging.TotalBudget, formatCurrency) },
                new FinAidCategoryViewModel { Category = resources.LblPrimaryEfc, Amount = FormatHelper.ToCurrency(finAidPackaging.PrimaryEfc, formatCurrency) },
                new FinAidCategoryViewModel { Category = resources.LblOriginalNeed, Amount = FormatHelper.ToCurrency(finAidPackaging.OriginalNeed, formatCurrency) },
                new FinAidCategoryViewModel { Category = resources.LblTotalFinancialAid, Amount = FormatHelper.ToCurrency(finAidPackaging.TotalPackageAward, formatCurrency) }
            };
            if (displayUnmetNeed)
                studentNeeds.Add(new FinAidCategoryViewModel { Category = resources.LblUnmetPackageNeed, Amount = FormatHelper.ToCurrency(finAidPackaging.UnmetPackageNeed, formatCurrency) });
            return studentNeeds;
        }

        /// <summary>
        /// Gets the funds.
        /// </summary>
        /// <param name="poeToken">The poe token.</param>
        /// <param name="academicTermAwards">The academic term awards.</param>
        /// <param name="formatCurrency">The format currency.</param>
        /// <returns></returns>
        private static List<FinAidFundViewModel> GetFunds(int poeToken, List<FinAidTermAward> academicTermAwards, IFormatProvider formatCurrency)
        {
            List<FinAidFundViewModel> funds = new();
            List<FinAidTermAward> fundsDTO = academicTermAwards.Where(x => x.PoeToken == poeToken).ToList();
            if (academicTermAwards != null)
            {
                foreach (FinAidTermAward item in fundsDTO)
                {
                    funds.Add(new FinAidFundViewModel
                    {
                        ActualAmount = FormatHelper.ToCurrency(item.ActualAmount, formatCurrency),
                        FundName = item.FundName,
                        ScheduledTermAmount = FormatHelper.ToCurrency(item.ScheduledAmount, formatCurrency),
                        Status = item.Status
                    });
                }
            }
            return funds;
        }

        /// <summary>
        /// Gets the total actual amount by term.
        /// </summary>
        /// <param name="poeToken">The poe token.</param>
        /// <param name="academicTermAwards">The academic term awards.</param>
        /// <param name="formatCurrency">The format currency.</param>
        /// <returns></returns>
        private static string GetTotalActualAmountByTerm(int poeToken, List<FinAidTermAward> academicTermAwards, IFormatProvider formatCurrency)
        {
            List<FinAidTermAward> fundsDTO = academicTermAwards.Where(x => x.PoeToken == poeToken).ToList();
            decimal total = fundsDTO.Sum(x => x.ActualAmount);
            return FormatHelper.ToCurrency(total, formatCurrency);
        }

        /// <summary>
        /// Gets the total scheduled amount by term.
        /// </summary>
        /// <param name="poeToken">The poe token.</param>
        /// <param name="academicTermAwards">The academic term awards.</param>
        /// <param name="formatCurrency">The format currency.</param>
        /// <returns></returns>
        private static string GetTotalScheduledAmountByTerm(int poeToken, List<FinAidTermAward> academicTermAwards, IFormatProvider formatCurrency)
        {
            List<FinAidTermAward> fundsDTO = academicTermAwards.Where(x => x.PoeToken == poeToken).ToList();
            decimal total = fundsDTO.Sum(x => x.ScheduledAmount);
            return FormatHelper.ToCurrency(total, formatCurrency);
        }

        #endregion Private Methods
    }
}