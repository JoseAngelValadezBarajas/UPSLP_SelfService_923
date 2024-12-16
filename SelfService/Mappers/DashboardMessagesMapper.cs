// --------------------------------------------------------------------
// <copyright file="DashboardMessagesMapper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using SelfService.Models.DashboardMessages;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace SelfService.Mappers
{
    /// <summary>
    /// DashboardMessagesMapper
    /// </summary>
    internal static class DashboardMessagesMapper
    {
        /// <summary>
        /// To the dto.
        /// </summary>
        /// <param name="dashboardMessageDetailViewModel">The dashboard message detail view model.</param>
        /// <returns></returns>
        /// <exception cref="System.Exception">End date is null
        /// or
        /// Start date is null
        /// or
        /// End time is null
        /// or
        /// Start time is null</exception>
        internal static DashboardMessageDetail ToDTO(this DashboardMessageDetailViewModel dashboardMessageDetailViewModel)
        {
            DashboardMessageDetail dashboardMessageDetail = null;
            if (dashboardMessageDetailViewModel != null)
            {
                DateTime? endDate = FormatHelper.FromDatePicker(dashboardMessageDetailViewModel.EndDate);
                DateTime? startDate = FormatHelper.FromDatePicker(dashboardMessageDetailViewModel.StartDate);
                DateTime? endTime = FormatHelper.FromTimePicker($"{dashboardMessageDetailViewModel.EndTime}:00");
                DateTime? startTime = FormatHelper.FromTimePicker($"{dashboardMessageDetailViewModel.StartTime}:00");
                if (endDate == null)
                    throw new Exception("End date is null");
                if (startDate == null)
                    throw new Exception("Start date is null");
                if (endTime == null)
                    throw new Exception("End time is null");
                if (startTime == null)
                    throw new Exception("Start time is null");
                dashboardMessageDetail = new DashboardMessageDetail
                {
                    EndDate = endDate.Value,
                    EndTime = endTime.Value,
                    GroupViewName = dashboardMessageDetailViewModel.GroupViewName,
                    Id = dashboardMessageDetailViewModel.Id,
                    Message = dashboardMessageDetailViewModel.Message,
                    Name = dashboardMessageDetailViewModel.Name,
                    Sort = dashboardMessageDetailViewModel.Sort,
                    StartDate = startDate.Value,
                    StartTime = startTime.Value,
                    Title = dashboardMessageDetailViewModel.Title,
                    Type = dashboardMessageDetailViewModel.Type,
                    Url = dashboardMessageDetailViewModel.Url ?? string.Empty,
                    UrlText = dashboardMessageDetailViewModel.UrlText ?? string.Empty
                };
            }
            return dashboardMessageDetail;
        }

        /// <summary>
        /// Converts to dto.
        /// </summary>
        /// <param name="dashboardMessagesDTO">The dashboard messages dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static DashboardMessagesViewModel ToViewModel(this DashboardMessages dashboardMessagesDTO, InstitutionSettings.General general)
        {
            DashboardMessagesViewModel dashboardMessagesViewModel = new();
            List<DashboardMessageViewModel> dashboardMessageViewModels = new();
            if (dashboardMessagesDTO != null && dashboardMessagesDTO?.DashboardMessageList.Count > 0)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                dashboardMessagesViewModel.OverallCount = dashboardMessagesDTO.OverallCount;
                foreach (DashboardMessage row in dashboardMessagesDTO.DashboardMessageList)
                {
                    dashboardMessageViewModels.Add(new DashboardMessageViewModel
                    {
                        EndDate = string.Format("{0} {1}", FormatHelper.ToShortDate(row.EndDate, datetimeCulture), FormatHelper.ToShortTime(row.EndTime, datetimeCulture)),
                        Id = row.Id,
                        Name = row.Name,
                        Sort = row.Sort,
                        StartDate = string.Format("{0} {1}", FormatHelper.ToShortDate(row.StartDate, datetimeCulture), FormatHelper.ToShortTime(row.StartTime, datetimeCulture)),
                        Type = row.Type
                    });
                }
                dashboardMessagesViewModel.DashboardMessageList = dashboardMessageViewModels;
            }
            return dashboardMessagesViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="dashboardMessageDetailDTO">The dashboard message detail dto.</param>
        /// <returns></returns>
        internal static DashboardMessageDetailViewModel ToViewModel(this DashboardMessageDetail dashboardMessageDetailDTO)
        {
            DashboardMessageDetailViewModel dashboardMessageDetail = null;
            if (dashboardMessageDetailDTO != null)
            {
                dashboardMessageDetail = new DashboardMessageDetailViewModel
                {
                    EndDate = FormatHelper.ToDatePicker(dashboardMessageDetailDTO.EndDate),
                    EndTime = FormatHelper.ToTimePicker(dashboardMessageDetailDTO.EndTime),
                    GroupViewName = dashboardMessageDetailDTO.GroupViewName,
                    Id = dashboardMessageDetailDTO.Id,
                    Message = dashboardMessageDetailDTO.Message,
                    Name = dashboardMessageDetailDTO.Name,
                    Sort = dashboardMessageDetailDTO.Sort,
                    StartDate = FormatHelper.ToDatePicker(dashboardMessageDetailDTO.StartDate),
                    StartTime = FormatHelper.ToTimePicker(dashboardMessageDetailDTO.StartTime),
                    Title = dashboardMessageDetailDTO.Title,
                    Type = dashboardMessageDetailDTO.Type,
                    Url = dashboardMessageDetailDTO.Url,
                    UrlText = dashboardMessageDetailDTO.UrlText
                };
            }
            return dashboardMessageDetail;
        }
    }
}