// --------------------------------------------------------------------
// <copyright file="AgreementsMapper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using SelfService.Models.Shared;
using System.Collections.Generic;
using System.Linq;

namespace SelfService.Mappers
{
    /// <summary>
    /// AgreementsMapper
    /// </summary>
    internal static class AgreementsMapper
    {
        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="agreementsDTO"></param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<BaseAgreement> agreementsDTO)
        {
            List<ListOptionViewModel> agreements = null;
            if (agreementsDTO?.Count > 0)
                agreements = agreementsDTO.Select(agr => new ListOptionViewModel
                {
                    Value = agr.Id,
                    Description = agr.Name
                }).ToList();
            return agreements;
        }
    }
}