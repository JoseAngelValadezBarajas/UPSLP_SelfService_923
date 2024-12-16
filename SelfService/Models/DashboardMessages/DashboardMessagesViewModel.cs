// --------------------------------------------------------------------
// <copyright file="DashboardMessagesViewModel.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Enum;
using System.Collections.Generic;

namespace SelfService.Models.DashboardMessages
{
    /// <summary>
    /// DashboardMessageDetailViewModel
    /// </summary>
    /// <seealso cref="SelfService.Models.DashboardMessages.DashboardMessageViewModel" />
    public class DashboardMessageDetailViewModel : DashboardMessageViewModel
    {
        /// <summary>
        /// Gets or sets the end time.
        /// </summary>
        /// <value>
        /// The end time.
        /// </value>
        public string EndTime { get; set; }

        /// <summary>
        /// Gets or sets the name of the group view.
        /// </summary>
        /// <value>
        /// The name of the group view.
        /// </value>
        public string GroupViewName { get; set; }

        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets the start time.
        /// </summary>
        /// <value>
        /// The start time.
        /// </value>
        public string StartTime { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the URL.
        /// </summary>
        /// <value>
        /// The URL.
        /// </value>
        public string Url { get; set; }

        /// <summary>
        /// Gets or sets the URL text.
        /// </summary>
        /// <value>
        /// The URL text.
        /// </value>
        public string UrlText { get; set; }
    }

    /// <summary>
    /// DashboardMessagesViewModel
    /// </summary>
    public class DashboardMessagesViewModel
    {
        /// <summary>
        /// Gets or sets the dashboard message list.
        /// </summary>
        /// <value>
        /// The dashboard message list.
        /// </value>
        public List<DashboardMessageViewModel> DashboardMessageList { get; set; }

        /// <summary>
        /// Gets or sets the overall count.
        /// </summary>
        /// <value>
        /// The overall count.
        /// </value>
        public int OverallCount { get; set; }
    }

    /// <summary>
    /// DashboardMessageViewModel
    /// </summary>
    public class DashboardMessageViewModel
    {
        /// <summary>
        /// Gets or sets the end date.
        /// </summary>
        /// <value>
        /// The end date.
        /// </value>
        public string EndDate { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the order.
        /// </summary>
        /// <value>
        /// The order.
        /// </value>
        public short Sort { get; set; }

        /// <summary>
        /// Gets or sets the start date.
        /// </summary>
        /// <value>
        /// The start date.
        /// </value>
        public string StartDate { get; set; }

        /// <summary>
        /// Gets or sets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        public DashboardMessageType Type { get; set; }
    }
}