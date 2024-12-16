// --------------------------------------------------------------------
// <copyright file="NotificationSetupViewModel.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Notifications
{
    /// <summary>
    /// NotificationSetupViewModel
    /// </summary>
    public class NotificationSetupViewModel
    {
        /// <summary>
        /// Gets or sets the cco.
        /// </summary>
        /// <value>
        /// The cco.
        /// </value>
        public string Cco { get; set; }

        /// <summary>
        /// Gets or sets the event code.
        /// </summary>
        /// <value>
        /// The event code.
        /// </value>
        public string EventCode { get; set; }

        /// <summary>
        /// Gets or sets from.
        /// </summary>
        /// <value>
        /// From.
        /// </value>
        public string From { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is active; otherwise, <c>false</c>.
        /// </value>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets the notification event identifier.
        /// </summary>
        /// <value>
        /// The notification event identifier.
        /// </value>
        public int NotificationEventId { get; set; }

        /// <summary>
        /// Gets or sets the notification setup identifier.
        /// </summary>
        /// <value>
        /// The notification setup identifier.
        /// </value>
        public int NotificationSetupId { get; set; }

        /// <summary>
        /// Gets or sets the subject.
        /// </summary>
        /// <value>
        /// The subject.
        /// </value>
        public string Subject { get; set; }

        /// <summary>
        /// Gets or sets to.
        /// </summary>
        /// <value>
        /// To.
        /// </value>
        public string To { get; set; }

        /// <summary>
        /// Gets or sets the type identifier.
        /// </summary>
        /// <value>
        /// The type identifier.
        /// </value>
        public int TypeId { get; set; }
    }
}