// --------------------------------------------------------------------
// <copyright file="BlockRegistrationRuleMapper.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
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
    /// BlockRegistrationRuleMapper
    /// </summary>
    internal static class BlockRegistrationRuleMapper
    {
        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="blockRegistrationRuleHeadersDTO">The block registration rule headers dto.</param>
        /// <returns></returns>
        internal static BlockRegistrationRuleHeadersViewModel ToViewModel(this BlockRegistrationRuleHeaders blockRegistrationRuleHeadersDTO)
        {
            BlockRegistrationRuleHeadersViewModel blockRegistrationRuleHeaders = new();
            if (blockRegistrationRuleHeadersDTO.BlockRegistrationRuleHeaderList?.Count > 0)
            {
                blockRegistrationRuleHeaders.OverallCount = blockRegistrationRuleHeadersDTO.OverallCount;
                blockRegistrationRuleHeaders.BlockRegistrationRuleHeaderList = blockRegistrationRuleHeadersDTO.BlockRegistrationRuleHeaderList.Select(
                    brg => new BlockRegistrationRuleHeaderViewModel
                    {
                        BlockRegistrationRuleId = brg.BlockRegistrationRuleId,
                        IsActive = brg.IsActive,
                        Name = brg.Name,
                        Priority = (int)brg.Priority
                    }).ToList();
            }
            return blockRegistrationRuleHeaders;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="blockRegistrationRuleDetailDTO">The block registration rule detail dto.</param>
        /// <param name="general">The general settings.</param>
        /// <returns></returns>
        internal static BlockRegistrationRuleDetailViewModel ToViewModel(this BlockRegistrationRule blockRegistrationRuleDetailDTO, InstitutionSettings.General general)
        {
            BlockRegistrationRuleDetailViewModel blockRegistrationRuleDetail = new();
            List<BlockRegistrationRuleGroupViewModel> blockRegistrationRuleGroups = new();
            if (blockRegistrationRuleDetailDTO != null)
            {
                blockRegistrationRuleDetail = new()
                {
                    BlockRegistrationRuleId = blockRegistrationRuleDetailDTO.BlockRegistrationRuleId,
                    IsActive = blockRegistrationRuleDetailDTO.IsActive,
                    IsBlockRegistrationOnly = (bool)blockRegistrationRuleDetailDTO.IsBlockRegistrationOnly,
                    Name = blockRegistrationRuleDetailDTO.Name,
                    Priority = (int)blockRegistrationRuleDetailDTO.Priority,
                    TermPeriodId = (int)blockRegistrationRuleDetailDTO.TermPeriodId,
                    ViewName = blockRegistrationRuleDetailDTO.ViewName
                };
                foreach (BlockRegistrationRuleGroup blockRegistrationRuleGroup in blockRegistrationRuleDetailDTO.BlockRegRuleGroups)
                {
                    blockRegistrationRuleGroups.Add(new()
                    {
                        BlockDetails = blockRegistrationRuleGroup.BlockRegRuleGroupBlocks.ToViewModel(general),
                        BlockRegistrationRuleGroupId = blockRegistrationRuleGroup.BlockRegistrationRuleGroupId,
                        DisplayName = blockRegistrationRuleGroup.DisplayName,
                        IsEditable = blockRegistrationRuleGroup.IsEditable,
                        Name = blockRegistrationRuleGroup.Name,
                        NumberOfBlocks = blockRegistrationRuleGroup.NumberOfBlocks,
                        Order = blockRegistrationRuleGroup.Order
                    });
                }
                blockRegistrationRuleDetail.BlockRegRuleGroups = blockRegistrationRuleGroups;
            }
            return blockRegistrationRuleDetail;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="blockRegRuleGroupBlockDTO">The block reg rule group block dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<BlockRegRuleGroupBlockViewModel> ToViewModel(this List<BlockRegRuleGroupBlock> blockRegRuleGroupBlockDTO,
            InstitutionSettings.General general)
        {
            List<BlockRegRuleGroupBlockViewModel> blockRegRuleGroupHeaderViewModels = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            if (blockRegRuleGroupBlockDTO != null)
            {
                foreach (BlockRegRuleGroupBlock blockRegRuleGroupBlock in blockRegRuleGroupBlockDTO)
                {
                    blockRegRuleGroupHeaderViewModels.Add(new BlockRegRuleGroupBlockViewModel
                    {
                        BlockRegistrationGroupId = blockRegRuleGroupBlock.BlockRegistrationGroupId,
                        BlockRegRuleGroupBlockId = blockRegRuleGroupBlock.BlockRegRuleGroupBlockId,
                        CreateDateTime = $"{FormatHelper.ToShortDate(blockRegRuleGroupBlock.CreateDateTime, datetimeCulture)} " +
                        $"{FormatHelper.ToShortTime(blockRegRuleGroupBlock.CreateDateTime, datetimeCulture)}",
                        IsActive = blockRegRuleGroupBlock.IsActive,
                        Name = blockRegRuleGroupBlock.Name,
                        NumberOfSections = blockRegRuleGroupBlock.NumberOfSections,
                        SectionIdList = blockRegRuleGroupBlock.SectionIdList,
                        RevisionDateTime = $"{FormatHelper.ToShortDate(blockRegRuleGroupBlock.RevisionDateTime, datetimeCulture)} " +
                        $"{FormatHelper.ToShortTime(blockRegRuleGroupBlock.RevisionDateTime, datetimeCulture)}",
                    });
                }
            }
            return blockRegRuleGroupHeaderViewModels;
        }
    }
}