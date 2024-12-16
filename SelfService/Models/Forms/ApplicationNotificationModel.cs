// --------------------------------------------------------------------
// <copyright file="ApplicationNotificationModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Forms
{
    /// <summary>
    /// ApplicationNotificationModel
    /// </summary>
    public class ApplicationNotificationModel
    {
        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the name of the form application.
        /// </summary>
        /// <value>
        /// The name of the form application.
        /// </value>
        public string FormApplicationName { get; set; }

        /// <summary>
        /// Gets or sets the URL to send.
        /// </summary>
        /// <value>
        /// The URL to send.
        /// </value>
        public string UrlToSend { get; set; }
    }
}