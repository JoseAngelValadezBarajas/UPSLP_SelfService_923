// --------------------------------------------------------------------
// <copyright file="NameFormatsMapper.cs" company="Ellucian">
//     Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.NameFormats;
using SelfService.Models.Resources.Administration;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SelfService.Mappers
{
    /// <summary>
    /// A mapper to format the data from DTOs to ViewModels(namespace SelfService.Models.Section)
    /// </summary>
    internal static class NameFormatCategoriesMapper
    {
        /// <summary>
        /// Map from NameFormatCategory to NameFormatCategoriesViewModel.
        /// </summary>
        /// <param name="nameFormatCategoriesDTO">The list of sections dto.</param>
        /// <param name="listOptionViewModel">The list option view model.</param>
        /// <returns></returns>
        internal static NameFormatCategoriesViewModel ToViewModel(this NameFormatCategory nameFormatCategoriesDTO, List<ListOptionViewModel> listOptionViewModel)
        {
            NameFormatCategoriesViewModel nameFormatCategoriesViewModel = new();
            List<NameFormatCategoryViewModel> nameFormatCategoryViewModelList = new();
            if (nameFormatCategoriesDTO?.NameFormatCategoryList?.Count > 0)
            {
                foreach (NameFormatCategoryItem nameFormatCategoryDTO in nameFormatCategoriesDTO.NameFormatCategoryList.Where(x => x.NameFormatCategoryId != null).ToList())
                {
                    NameFormatCategoryViewModel nameFormatCategoryViewModel = new()
                    {
                        CategoryId = (int)nameFormatCategoryDTO.NameFormatCategoryId,
                        NameFormatId = nameFormatCategoryDTO.NameFormatId,
                        CategoryCode = nameFormatCategoryDTO.Category,
                        NameFormatDesc = nameFormatCategoryDTO.FormatName
                    };
                    nameFormatCategoryViewModelList.Add(nameFormatCategoryViewModel);
                }
                nameFormatCategoriesViewModel.NameFormatCategoryList = nameFormatCategoryViewModelList;
                nameFormatCategoriesViewModel.NameFormatList = listOptionViewModel;
            }
            return nameFormatCategoriesViewModel;
        }

        /// <summary>
        /// Map from NameFormat to NameFormatViewModel
        /// </summary>
        /// <param name="nameFormatListDTO">The name format dto.</param>
        /// <returns>
        /// List(NameFormatViewModel)
        /// </returns>
        internal static NameFormatListViewModel ToViewModel(this NameFormat nameFormatListDTO)
        {
            NameFormatListViewModel nameFormat = new();
            if (nameFormatListDTO?.NameFormatList?.Count > 0)
            {
                nameFormat.OverallCount = nameFormatListDTO.OverallCount;
                nameFormat.NameFormatList = new List<NameFormatItemViewModel>();
                NameFormatItemViewModel nameFormatViewModel = null;
                foreach (NameFormatItem nameFormatItemDTO in nameFormatListDTO.NameFormatList)
                {
                    nameFormatViewModel = new NameFormatItemViewModel
                    {
                        Id = nameFormatItemDTO.NameFormatId,
                        Name = nameFormatItemDTO.FormatName,
                        IsActive = nameFormatItemDTO.IsActive,
                        IsAssignedToCategory = nameFormatItemDTO.AssignedToCategory
                    };
                    nameFormat.NameFormatList.Add(nameFormatViewModel);
                }
            }
            return nameFormat;
        }

        /// <summary>
        /// Map from NameFormatItem to NameFormatViewModel
        /// </summary>
        /// <param name="nameFormatItemDTO">The name format item dto.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="resources">The resources.</param>
        /// <returns></returns>
        internal static NameFormatItemViewModel ToViewModel(this NameFormatItem nameFormatItemDTO, bool showMiddleNameInitial, NamePartResources resources) => nameFormatItemDTO != null
            ? new NameFormatItemViewModel
            {
                Id = nameFormatItemDTO.NameFormatId,
                IsActive = nameFormatItemDTO.IsActive,
                IsAssignedToCategory = nameFormatItemDTO.AssignedToCategory,
                Name = nameFormatItemDTO.FormatName,
                NamePartList = GetNamePartList(nameFormatItemDTO),
                Preview = GetNameFormatPreview(nameFormatItemDTO.FormatDefinition, showMiddleNameInitial, resources),
                ShowMiddleNameInitial = nameFormatItemDTO.ShowMiddleNameInitial,
                SortPreview = GetSortPreview(nameFormatItemDTO.FormatSort, resources),
            }
            : new NameFormatItemViewModel
            {
                Id = 0,
                IsActive = false,
                IsAssignedToCategory = false,
                Name = string.Empty,
                NamePartList = null,
                Preview = string.Empty,
                ShowMiddleNameInitial = false,
                SortPreview = string.Empty
            };

        #region Private Methods

        /// <summary>
        /// Gets the name format preview.
        /// </summary>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="resources">The resources.</param>
        /// <returns>
        /// The name format preview
        /// </returns>
        private static string GetNameFormatPreview(string nameFormat, bool showMiddleNameInitial, NamePartResources resources) => FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(
            new string[]
            {
                resources.LblPrefix,
                resources.LblFirstName,
                resources.LblMiddleName,
                resources.LblLastNamePrefix,
                resources.LblLastName,
                resources.LblDisplayName,
                resources.LblPronoun,
                resources.LblSuffix
            }), nameFormat, showMiddleNameInitial);

        /// <summary>
        /// Gets the name part list.
        /// </summary>
        /// <param name="nameFormatItemDTO">The name format item dto.</param>
        /// <returns></returns>
        private static List<NamePartItemViewModel> GetNamePartList(NameFormatItem nameFormatItemDTO)
        {
            List<NamePartItemViewModel> namePartList = new();
            NamePartItemViewModel namePartItemViewModel = null;

            if (!string.IsNullOrEmpty(nameFormatItemDTO.FormatDefinition))
            {
                string[] nameParts = nameFormatItemDTO.FormatDefinition.Split('|');
                string[] sortOrders = nameFormatItemDTO.FormatSort.Split('|');
                for (int i = 0; i < nameParts.Length; i++)
                {
                    namePartItemViewModel = new NamePartItemViewModel
                    {
                        NamePart = nameParts[i].Substring(0, 2),
                        DisplayOrder = i + 1,
                        Separator = nameParts[i].Substring(2),
                        SortOrder = Array.IndexOf(sortOrders, nameParts[i].Substring(0, 2)) + 1
                    };
                    namePartItemViewModel.SortOrder = namePartItemViewModel.SortOrder < 0 ? 0 : namePartItemViewModel.SortOrder;
                    namePartList.Add(namePartItemViewModel);
                }
            }

            return namePartList;
        }

        /// <summary>
        /// Gets the sort preview.
        /// </summary>
        /// <param name="formatSort">The format sort.</param>
        /// <param name="resources">The resources.</param>
        /// <returns></returns>
        private static string GetSortPreview(string formatSort, NamePartResources resources)
        {
            StringBuilder sortPreviewBuilder = new();
            string[] sortOrders = formatSort.Split('|');
            for (int i = 0; i < sortOrders.Length; i++)
            {
                if (sortOrders[i].Equals("PX"))
                    sortPreviewBuilder.Append(resources.LblPrefix).Append(" ");
                if (sortOrders[i].Equals("FN"))
                    sortPreviewBuilder.Append(resources.LblFirstName).Append(" ");
                if (sortOrders[i].Equals("MN"))
                    sortPreviewBuilder.Append(resources.LblMiddleName).Append(" ");
                if (sortOrders[i].Equals("LP"))
                    sortPreviewBuilder.Append(resources.LblLastNamePrefix).Append(" ");
                if (sortOrders[i].Equals("LN"))
                    sortPreviewBuilder.Append(resources.LblLastName).Append(" ");
                if (sortOrders[i].Equals("SX"))
                    sortPreviewBuilder.Append(resources.LblSuffix).Append(" ");
                if (sortOrders[i].Equals("DN"))
                    sortPreviewBuilder.Append(resources.LblDisplayName).Append(" ");
                if (sortOrders[i].Equals("PN"))
                    sortPreviewBuilder.Append(resources.LblPronoun).Append(" ");
            }
            return sortPreviewBuilder.ToString().Trim();
        }

        #endregion Private Methods
    }
}