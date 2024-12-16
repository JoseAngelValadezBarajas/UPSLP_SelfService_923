// --------------------------------------------------------------------
// <copyright file="BlockRegistrationResources.cs" company="Ellucian">
//     Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class BlockRegistrationOptionsResources
    {
        public string LblBlocks { get; set; }
        public string LblRules { get; set; }
    }

    public class BlockRegistrationResources
    {
        public BlockRegistrationOptionsResources BlockRegistrationOptions { get; set; }
        public string LblEmptyState { get; set; }
        public string LblNoResults { get; set; }
        public string LblPageDescription { get; set; }
        public string LblPeriod { get; set; }
        public string LblSidebar { get; set; }
        public string LblWarning { get; set; }
        public SidebarResources Sidebar { get; set; }
    }

    public class SidebarResources
    {
        public string LblCloseSidebar { get; set; }
        public string LblOpenSidebar { get; set; }
    }
}