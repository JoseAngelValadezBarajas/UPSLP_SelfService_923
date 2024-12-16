// --------------------------------------------------------------------
// <copyright file="NotificationEventViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.Enum;
using System.Collections.Generic;

namespace SelfService.Models.Notifications
{
    /// <summary>
    /// NotificationEventViewModel
    /// </summary>
    public class NotificationEventViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NotificationEventViewModel" /> class.
        /// </summary>
        public NotificationEventViewModel() => this.EventTypes = new List<string>();

        /// <summary>
        /// Gets or sets the area.
        /// </summary>
        /// <value>
        /// The area.
        /// </value>
        public NotificationEventArea Area { get; set; }

        /// <summary>
        /// Gets or sets the event code.
        /// </summary>
        /// <value>
        /// The event code.
        /// </value>
        public string EventCode { get; set; }

        /// <summary>
        /// Gets or sets the event description.
        /// </summary>
        /// <value>
        /// The event description.
        /// </value>
        public string EventDescription { get; set; }

        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public int EventId { get; set; }

        /// <summary>
        /// Gets or sets the name of the event.
        /// </summary>
        /// <value>
        /// The name of the event.
        /// </value>
        public string EventName { get; set; }

        /// <summary>
        /// Gets or sets the event types.
        /// </summary>
        /// <value>
        /// The event types.
        /// </value>
        public List<string> EventTypes { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is active; otherwise, <c>false</c>.
        /// </value>
        public bool IsActive { get; set; }

        /// <summary>
        /// The token group detail
        /// </summary>
        public List<TokenGroupDetailViewModel> TokenGroupDetail { get; set; }
    }
}