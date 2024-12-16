// --------------------------------------------------------------------
// <copyright file="NotificationsViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using System;

namespace SelfService.Models.Notifications
{
    /// <summary>
    /// Notification view model
    /// </summary>
    public class NotificationViewModel
    {
        /// <summary>
        /// Gets or sets the create datetime.
        /// </summary>
        /// <value>
        /// The create datetime.
        /// </value>
        public string CreateDatetime { get; set; }

        /// <summary>
        /// Gets or sets the notification identifier.
        /// </summary>
        /// <value>
        /// The notification identifier.
        /// </value>
        public Guid NotificationId { get; set; }

        /// <summary>
        /// Gets or sets the type of the notification.
        /// </summary>
        /// <value>
        /// The type of the notification.
        /// </value>
        public NotificationType NotificationType { get; set; }

        /// <summary>
        /// Gets or sets the person from.
        /// </summary>
        /// <value>
        /// The person from.
        /// </value>
        public string PersonFrom { get; set; }

        /// <summary>
        /// Gets or sets the person identifier from.
        /// </summary>
        /// <value>
        /// The person identifier from.
        /// </value>
        public int PersonIdFrom { get; set; }

        /// <summary>
        /// Gets or sets the person identifier to.
        /// </summary>
        /// <value>
        /// The person identifier to.
        /// </value>
        public int PersonIdTo { get; set; }

        /// <summary>
        /// Gets or sets the revision datetime.
        /// </summary>
        /// <value>
        /// The revision datetime.
        /// </value>
        public string RevisionDatetime { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is active; otherwise, <c>false</c>.
        /// </value>
        public bool Status { get; set; }
    }
}