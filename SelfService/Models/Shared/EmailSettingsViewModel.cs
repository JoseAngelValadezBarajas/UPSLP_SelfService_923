// --------------------------------------------------------------------
// <copyright file="EmailSettingsViewModel.cs" company="Ellucian">
//     Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Shared
{
    /// <summary>
    /// EmailSettingsViewModel
    /// </summary>
    public class EmailSettingsViewModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance can edit recipient.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance can edit recipient; otherwise, <c>false</c>.
        /// </value>
        public bool CanEditRecipient { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance can edit sender.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance can edit sender; otherwise, <c>false</c>.
        /// </value>
        public bool CanEditSender { get; set; }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the email provider.
        /// </summary>
        /// <value>
        /// The email provider.
        /// </value>
        public int EmailProvider { get; set; }

        /// <summary>
        /// Gets or sets the sender.
        /// </summary>
        /// <value>
        /// The sender.
        /// </value>
        public int Sender { get; set; }

        /// <summary>
        /// Gets or sets the staff separator.
        /// </summary>
        /// <value>
        /// The staff separator.
        /// </value>
        public string StaffSeparator { get; set; }

        /// <summary>
        /// Gets or sets the staff URL.
        /// </summary>
        /// <value>
        /// The staff URL.
        /// </value>
        public string StaffUrl { get; set; }

        /// <summary>
        /// Gets or sets the student separator.
        /// </summary>
        /// <value>
        /// The student separator.
        /// </value>
        public string StudentSeparator { get; set; }

        /// <summary>
        /// Gets or sets the student URL.
        /// </summary>
        /// <value>
        /// The student URL.
        /// </value>
        public string StudentUrl { get; set; }
    }
}