// --------------------------------------------------------------------
// <copyright file="SavedApplicationMapper.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Recruitment;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.Forms;
using System.Collections.Generic;
using System.Globalization;

namespace SelfService.Mappers
{
    /// <summary>
    /// SavedApplicationMapper
    /// </summary>
    internal static class SavedApplicationMapper
    {
        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="savedApplicationListDTO">The saved application list dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<SavedApplicationViewModel> ToViewModel(this List<SavedApplication> savedApplicationListDTO, InstitutionSettings.General general)
        {
            List<SavedApplicationViewModel> savedApplicationListViewModel = new();
            CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
            SavedApplicationViewModel savedApplicationViewModel;
            foreach (SavedApplication savedApplicationDTO in savedApplicationListDTO)
            {
                savedApplicationViewModel = new SavedApplicationViewModel
                {
                    ApplicationFormDescription = savedApplicationDTO.ApplicationFormDescription,
                    ApplicationFormName = savedApplicationDTO.ApplicationFormName,
                    CreateDatetime =
                    $"{FormatHelper.ToShortDate(savedApplicationDTO.CreateDatetime, datetimeCulture)} {FormatHelper.ToShortTime(savedApplicationDTO.CreateDatetime, datetimeCulture)}",
                    RevisionDatetime =
                    $"{FormatHelper.ToShortDate(savedApplicationDTO.RevisionDatetime, datetimeCulture)} {FormatHelper.ToShortTime(savedApplicationDTO.RevisionDatetime, datetimeCulture)}",
                    SavedApplicationId = savedApplicationDTO.SavedApplicationId,
                    Token = savedApplicationDTO.Token
                };
                savedApplicationListViewModel.Add(savedApplicationViewModel);
            }

            return savedApplicationListViewModel;
        }
    }
}