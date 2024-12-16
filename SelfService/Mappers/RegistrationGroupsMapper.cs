// --------------------------------------------------------------------
// <copyright file="RegistrationGroupsMapper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.RegistrationGroups;
using System;

namespace SelfService.Mappers
{
    /// <summary>
    /// RegistrationGroupsMapper
    /// </summary>
    internal static class RegistrationGroupsMapper
    {
        /// <summary>
        /// Converts to dto.
        /// </summary>
        /// <param name="registrationGroupDetailViewModel">The registration group detail view model.</param>
        /// <returns></returns>
        /// <exception cref="System.Exception">End registration time is null
        /// or
        /// Start registration time is null</exception>
        internal static RegistrationGroupDetail ToDTO(this RegistrationGroupDetailViewModel registrationGroupDetailViewModel)
        {
            RegistrationGroupDetail registrationGroupDetail = null;
            if (registrationGroupDetailViewModel != null)
            {
                DateTime? endRegistrationDate = FormatHelper.FromDatePicker(registrationGroupDetailViewModel.EndRegistrationDate);
                DateTime? startRegistrationDate = FormatHelper.FromDatePicker(registrationGroupDetailViewModel.StartRegistrationDate);
                DateTime? endRegistrationTime = FormatHelper.FromTimeDropDown(registrationGroupDetailViewModel.EndRegistrationHour, registrationGroupDetailViewModel.EndRegistrationMinute);
                DateTime? startRegistrationTime = FormatHelper.FromTimeDropDown(registrationGroupDetailViewModel.StartRegistrationHour, registrationGroupDetailViewModel.StartRegistrationMinute);
                if (endRegistrationTime == null)
                    throw new Exception("End registration time is null");
                if (startRegistrationTime == null)
                    throw new Exception("Start registration time is null");
                registrationGroupDetail = new()
                {
                    Id = registrationGroupDetailViewModel.Id,
                    IsActive = registrationGroupDetailViewModel.IsActive,
                    Name = registrationGroupDetailViewModel.Name,
                    Sort = registrationGroupDetailViewModel.Sort,
                    AdvisorApprovalRequired = registrationGroupDetailViewModel.AdvisorApprovalRequired,
                    AuthorizationRequired = registrationGroupDetailViewModel.AuthorizationRequired,
                    DropApprovalRequired = registrationGroupDetailViewModel.DropApprovalRequired,
                    EndOffset = registrationGroupDetailViewModel.EndOffset,
                    EndRegistrationDate = endRegistrationDate,
                    EndRegistrationTime = endRegistrationTime.Value,
                    EndRegistrationType = GetBaseDateType(registrationGroupDetailViewModel.EndRegistrationType),
                    ViewName = registrationGroupDetailViewModel.GroupViewName,
                    StartOffset = registrationGroupDetailViewModel.StartOffset,
                    StartRegistrationDate = startRegistrationDate,
                    StartRegistrationTime = startRegistrationTime.Value,
                    StartRegistrationType = GetBaseDateType(registrationGroupDetailViewModel.StartRegistrationType)
                };
            }
            return registrationGroupDetail;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="registrationGroupDetailDTO">The registration group detail dto.</param>
        /// <returns></returns>
        internal static RegistrationGroupDetailViewModel ToViewModel(this RegistrationGroupDetail registrationGroupDetailDTO)
        {
            RegistrationGroupDetailViewModel registrationGroupDetail = new();
            if (registrationGroupDetailDTO != null)
            {
                registrationGroupDetail = new()
                {
                    Id = registrationGroupDetailDTO.Id,
                    IsActive = registrationGroupDetailDTO.IsActive,
                    Name = registrationGroupDetailDTO.Name,
                    Sort = registrationGroupDetailDTO.Sort,
                    AdvisorApprovalRequired = registrationGroupDetailDTO.AdvisorApprovalRequired,
                    AuthorizationRequired = registrationGroupDetailDTO.AuthorizationRequired,
                    DropApprovalRequired = registrationGroupDetailDTO.DropApprovalRequired,
                    EndOffset = registrationGroupDetailDTO.EndOffset,
                    EndRegistrationDate = FormatHelper.ToDatePicker(registrationGroupDetailDTO.EndRegistrationDate),
                    EndRegistrationHour = registrationGroupDetailDTO.EndRegistrationTime.Hour,
                    EndRegistrationMinute = registrationGroupDetailDTO.EndRegistrationTime.Minute,
                    EndRegistrationType = GetBaseDateCode(registrationGroupDetailDTO.EndRegistrationType),
                    GroupViewName = registrationGroupDetailDTO.ViewName,
                    StartOffset = registrationGroupDetailDTO.StartOffset,
                    StartRegistrationDate = FormatHelper.ToDatePicker(registrationGroupDetailDTO.StartRegistrationDate),
                    StartRegistrationHour = registrationGroupDetailDTO.StartRegistrationTime.Hour,
                    StartRegistrationMinute = registrationGroupDetailDTO.StartRegistrationTime.Minute,
                    StartRegistrationType = GetBaseDateCode(registrationGroupDetailDTO.StartRegistrationType)
                };
            }
            return registrationGroupDetail;
        }

        /// <summary>
        /// Gets the base date code.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <returns></returns>
        private static string GetBaseDateCode(StartEndRegistrationType type)
        {
            return type switch
            {
                StartEndRegistrationType.Exact => "EXACT",
                StartEndRegistrationType.PreRegistration => "PREREG",
                StartEndRegistrationType.Registration => "REG",
                StartEndRegistrationType.EndRegistration => "ENDREG",
                _ => "PREREG",
            };
        }

        /// <summary>
        /// Gets the type of the base date.
        /// </summary>
        /// <param name="code">The code.</param>
        /// <returns></returns>
        private static StartEndRegistrationType GetBaseDateType(string code)
        {
            return code switch
            {
                "EXACT" => StartEndRegistrationType.Exact,
                "PREREG" => StartEndRegistrationType.PreRegistration,
                "REG" => StartEndRegistrationType.Registration,
                "ENDREG" => StartEndRegistrationType.EndRegistration,
                _ => StartEndRegistrationType.PreRegistration,
            };
        }
    }
}