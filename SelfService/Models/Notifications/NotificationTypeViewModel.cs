// --------------------------------------------------------------------
// <copyright file="NotificationTypeViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using System.Collections.Generic;

namespace SelfService.Models.Notifications
{
    /// <summary>
    /// NotificationTypeViewModel
    /// </summary>
    public class NotificationTypeViewModel
    {
        /// <summary>
        /// Gets or sets the notification template items.
        /// </summary>
        /// <value>
        /// The notification template items.
        /// </value>
        public List<NotificationTemplate> NotificationTemplate { get; set; }

        /// <summary>
        /// Gets or sets the type identifier.
        /// </summary>
        /// <value>
        /// The type identifier.
        /// </value>
        public int TypeId { get; set; }
    }
}