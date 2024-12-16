// --------------------------------------------------------------------
// <copyright file="DashboardMessagesModel.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.DashboardMessages
{
    /// <summary>
    /// DashboardMessagesModel
    /// </summary>
    /// <seealso cref="SelfService.Models.DashboardMessages.DashboardMessageViewModel" />
    public class DashboardMessagesModel
    {
        /// <summary>
        /// Gets or sets the dashboard message detail.
        /// </summary>
        /// <value>
        /// The dashboard message detail.
        /// </value>
        public DashboardMessageDetailViewModel DashboardMessageDetail { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="DashboardMessagesModel"/> is process.
        /// </summary>
        /// <value>
        ///   <c>true</c> if process; otherwise, <c>false</c>.
        /// </value>
        public bool Process { get; set; }
    }
}