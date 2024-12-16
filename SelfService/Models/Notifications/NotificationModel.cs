// --------------------------------------------------------------------
// <copyright file="NotificationModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Notifications
{
    /// <summary>
    /// NotificationModel class
    /// </summary>
    public class NotificationModel
    {
        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public int EventId { get; set; }

        /// <summary>
        /// Gets or sets the type identifier.
        /// </summary>
        /// <value>
        /// The type identifier.
        /// </value>
        public int TypeId { get; set; }
    }
}