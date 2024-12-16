// --------------------------------------------------------------------
// <copyright file="BlockRegistrationGroupMapper.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.Administration;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SelfService.Mappers
{
    /// <summary>
    /// BlockRegistrationGroupMapper
    /// </summary>
    internal static class BlockRegistrationGroupMapper
    {
        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="blockRegistrationGroupHeadersDTO">The block registration group headers dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static BlockRegistrationGroupHeadersViewModel ToViewModel(this BlockRegistrationGroupHeaders blockRegistrationGroupHeadersDTO,
            InstitutionSettings.General general)
        {
            BlockRegistrationGroupHeadersViewModel blockRegistrationGroupHeaders = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            if (blockRegistrationGroupHeadersDTO.BlockRegistrationGroupHeaderList?.Count > 0)
            {
                blockRegistrationGroupHeaders.OverallCount = blockRegistrationGroupHeadersDTO.OverallCount;
                blockRegistrationGroupHeaders.BlockRegistrationGroupHeaderList = blockRegistrationGroupHeadersDTO.BlockRegistrationGroupHeaderList.Select(
                    brg => new BlockRegistrationGroupHeaderViewModel
                    {
                        BlockRegistrationGroupId = brg.BlockRegistrationGroupId,
                        CreateDateTime = $"{FormatHelper.ToShortDate(brg.CreateDateTime, datetimeCulture)} " +
                            $"{FormatHelper.ToShortTime(brg.CreateDateTime, datetimeCulture)}",
                        RevisionDateTime = $"{FormatHelper.ToShortDate(brg.RevisionDateTime, datetimeCulture)} " +
                            $"{FormatHelper.ToShortTime(brg.RevisionDateTime, datetimeCulture)}",
                        IsActive = brg.IsActive,
                        Name = brg.Name,
                        NumberOfSections = brg.NumberOfSections,
                        SectionIdList = brg.SectionIdList
                    }).ToList();
            }
            return blockRegistrationGroupHeaders;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="blockRegistrationGroupDetailDTO">The block registration group detail dto.</param>
        /// <param name="CurrentNameFormat">The current name format.</param>
        /// <param name="CurrentNameSort">The current name sort.</param>
        /// <param name="enableWaitList">if set to <c>true</c> [enable wait list].</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="registration">The registration.</param>
        /// <returns></returns>
        internal static BlockRegistrationGroupDetailViewModel ToViewModel(this BlockRegistrationGroupDetail blockRegistrationGroupDetailDTO,
            string CurrentNameFormat, string CurrentNameSort, bool enableWaitList, InstitutionSettings.General general, bool showMiddleNameInitial,
            InstitutionSettings.Registration registration)
        {
            BlockRegistrationGroupDetailViewModel blockRegistrationGroupDetail = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            if (blockRegistrationGroupDetailDTO != null && blockRegistrationGroupDetailDTO?.RegistrationGroup != null)
            {
                blockRegistrationGroupDetail.BlockRegistrationGroup = new()
                {
                    AllowChanges = blockRegistrationGroupDetailDTO.RegistrationGroup.AllowChanges,
                    BlockRegistrationGroupId = blockRegistrationGroupDetailDTO.RegistrationGroup.BlockRegistrationGroupId,
                    CreateDateTime = $"{FormatHelper.ToShortDate(blockRegistrationGroupDetailDTO.RegistrationGroup.CreateDateTime, datetimeCulture)} " +
                    $"{FormatHelper.ToShortTime(blockRegistrationGroupDetailDTO.RegistrationGroup.CreateDateTime, datetimeCulture)}",
                    Description = blockRegistrationGroupDetailDTO.RegistrationGroup.Description,
                    DisplayName = blockRegistrationGroupDetailDTO.RegistrationGroup.DisplayName,
                    IsActive = blockRegistrationGroupDetailDTO.RegistrationGroup.IsActive,
                    IsEditable = blockRegistrationGroupDetailDTO.RegistrationGroup.IsEditable,
                    Name = blockRegistrationGroupDetailDTO.RegistrationGroup.Name,
                    NumberOfSections = blockRegistrationGroupDetailDTO.RegistrationGroup.NumberOfSections,
                    RevisionDateTime = $"{FormatHelper.ToShortDate(blockRegistrationGroupDetailDTO.RegistrationGroup.RevisionDateTime, datetimeCulture)} " +
                    $"{FormatHelper.ToShortTime(blockRegistrationGroupDetailDTO.RegistrationGroup.RevisionDateTime, datetimeCulture)}",
                    TermPeriodId = blockRegistrationGroupDetailDTO.RegistrationGroup.TermPeriodId
                };
                blockRegistrationGroupDetail.SectionList = blockRegistrationGroupDetailDTO.Sections.ToViewModel(CurrentNameFormat, CurrentNameSort, enableWaitList, general,
                    showMiddleNameInitial, registration);
            }
            return blockRegistrationGroupDetail;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="blockRegRuleGroups">The block reg rule groups.</param>
        /// <param name="CurrentNameFormat">The current name format.</param>
        /// <param name="CurrentNameSort">The current name sort.</param>
        /// <param name="enableWaitList">if set to <c>true</c> [enable wait list].</param>
        /// <param name="general">The general.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="registration">The registration.</param>
        /// <returns></returns>
        internal static List<BlockRegRuleGroupViewModel> ToViewModel(this List<BlockRegRuleGroup> blockRegRuleGroups,
          string CurrentNameFormat, string CurrentNameSort, bool enableWaitList, InstitutionSettings.General general, bool showMiddleNameInitial,
          InstitutionSettings.Registration registration)
        {
            List<BlockRegRuleGroupViewModel> blockRegRuleGroupViewModels = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            if (blockRegRuleGroups != null)
            {
                foreach (BlockRegRuleGroup row in blockRegRuleGroups)
                {
                    BlockRegRuleGroupViewModel blockRegRuleGroupViewModel = new();
                    blockRegRuleGroupViewModel.BlockRegistrationGroup = new()
                    {
                        AllowChanges = row.RegistrationGroup.AllowChanges,
                        BlockRegistrationGroupId = row.RegistrationGroup.BlockRegistrationGroupId,
                        CreateDateTime = $"{FormatHelper.ToShortDate(row.RegistrationGroup.CreateDateTime, datetimeCulture)} " +
                            $"{FormatHelper.ToShortTime(row.RegistrationGroup.CreateDateTime, datetimeCulture)}",
                        Description = row.RegistrationGroup.Description,
                        DisplayName = row.RegistrationGroup.DisplayName,
                        IsActive = row.RegistrationGroup.IsActive,
                        IsEditable = row.RegistrationGroup.IsEditable,
                        Name = row.RegistrationGroup.Name,
                        NumberOfSections = row.RegistrationGroup.NumberOfSections,
                        RevisionDateTime = $"{FormatHelper.ToShortDate(row.RegistrationGroup.RevisionDateTime, datetimeCulture)} " +
                            $"{FormatHelper.ToShortTime(row.RegistrationGroup.RevisionDateTime, datetimeCulture)}",
                        TermPeriodId = row.RegistrationGroup.TermPeriodId
                    };
                    blockRegRuleGroupViewModel.BlockRegRuleGroupBlockId = row.BlockRegRuleGroupBlockId;
                    blockRegRuleGroupViewModel.SectionList = row.Sections.ToViewModel(CurrentNameFormat, CurrentNameSort, enableWaitList, general, showMiddleNameInitial, registration);
                    blockRegRuleGroupViewModel.TotalCredits = FormatHelper.ToCredits(row.TotalCredits, general.Credits);
                    blockRegRuleGroupViewModels.Add(blockRegRuleGroupViewModel);
                }
            }
            return blockRegRuleGroupViewModels;
        }
    }
}