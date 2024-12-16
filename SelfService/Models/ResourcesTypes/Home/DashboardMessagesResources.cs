// --------------------------------------------------------------------
// <copyright file="DashboardMessagesResources.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Home
{
    public class DashboardMessagesPanelResources
    {
        public string LblMessages { get; set; }
    }

    public class DashboardMessagesResources
    {
        public DashboardMessageCardResources DashboardMessageCard { get; set; }
        public DashboardMessagesPanelResources DashboardMessagesPanel { get; set; }
        public string LblMoveToLeft { get; set; }
        public string LblMoveToRight { get; set; }
    }
}