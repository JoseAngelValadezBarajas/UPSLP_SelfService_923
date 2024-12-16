// --------------------------------------------------------------------
// <copyright file="DashboardMapper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using SelfService.Models.Dashboard;
using System.Collections.Generic;

namespace SelfService.Mappers
{
    /// <summary>
    /// DashboardMapper
    /// </summary>
    internal static class DashboardMapper
    {
        /// <summary>
        /// Converts to notificationviewmodel.
        /// </summary>
        /// <param name="dashboardMessagesDetailDTO">The dashboard messages detail dto.</param>
        /// <returns></returns>
        internal static List<DashboardNotificationViewModel> ToNotificationViewModel(this List<DashboardMessageDetail> dashboardMessagesDetailDTO)
        {
            List<DashboardNotificationViewModel> dashboardNotificationsDetail = null;
            if (dashboardMessagesDetailDTO?.Count > 0)
            {
                dashboardNotificationsDetail = dashboardMessagesDetailDTO.ConvertAll(dn => new DashboardNotificationViewModel
                {
                    Message = dn.Message,
                    Title = dn.Title,
                    Type = dn.Type,
                    Url = dn.Url,
                    UrlText = dn.UrlText
                });
            }
            return dashboardNotificationsDetail;
        }
    }
}