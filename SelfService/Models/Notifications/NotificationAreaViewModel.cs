// --------------------------------------------------------------------
// <copyright file="NotificationAreaViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Enum;
using System.Collections.Generic;

namespace SelfService.Models.Notifications
{
    /// <summary>
    /// Notification Area View Model
    /// </summary>
    public class NotificationAreaViewModel
    {
        /// <summary>
        /// Gets or sets the area.
        /// </summary>
        /// <value>
        /// The area.
        /// </value>
        public NotificationEventArea Area { get; set; }

        /// <summary>
        /// Gets or sets the notification events.
        /// </summary>
        /// <value>
        /// The notification events.
        /// </value>
        public List<NotificationEventViewModel> NotificationEvents { get; set; }
    }
}