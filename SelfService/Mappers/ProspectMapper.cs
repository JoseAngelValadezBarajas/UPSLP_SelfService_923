// --------------------------------------------------------------------
// <copyright file="ProspectMapper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.Account;
using System;

namespace SelfService.Mappers
{
    /// <summary>
    /// ProspectMapper
    /// </summary>
    internal static class ProspectMapper
    {
        /// <summary>
        /// Converts to dto.
        /// </summary>
        /// <param name="conEdProspect">The con ed prospect.</param>
        /// <returns></returns>
        internal static ConEdProspect ToDTO(this ConEdProspectViewModel conEdProspect)
        {
            ConEdProspect conEdProspectDTO = null;
            if (conEdProspect != null)
            {
                DateTime? birthDate = FormatHelper.FromDatePicker(conEdProspect.BirthDateFormatted);
                conEdProspectDTO = new ConEdProspect()
                {
                    Address = conEdProspect.Address,
                    Phone = conEdProspect.Phone,
                    BirthDate = birthDate,
                    DisplayName = conEdProspect.DisplayName,
                    Email = conEdProspect.Email,
                    EmailType = conEdProspect.EmailType,
                    FirstName = conEdProspect.FirstName,
                    GovernmentId = conEdProspect.GovernmentId,
                    Interests = conEdProspect.Interests,
                    LastName = conEdProspect.LastName,
                    LastNamePrefix = conEdProspect.LastNamePrefix,
                    MiddleName = conEdProspect.MiddleName,
                    PrefixId = conEdProspect.PrefixId,
                    Sources = conEdProspect.Sources,
                    SuffixId = conEdProspect.SuffixId
                };
            }
            return conEdProspectDTO;
        }
    }
}