// --------------------------------------------------------------------
// <copyright file="BlockListResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class BlockItem
    {
        public BlockSections BlockSections { get; set; }
        public string LblActive { get; set; }
        public string LblAlerts { get; set; }
        public string LblCourses { get; set; }
        public string LblCreated { get; set; }
        public string LblEnable { get; set; }
        public string LblHideDetails { get; set; }
        public string LblInactive { get; set; }
        public string LblModified { get; set; }
        public string LblNoSections { get; set; }
        public string LblRemove { get; set; }
        public string LblSectionInUse { get; set; }
        public string LblShowDetails { get; set; }
        public string LblStatus { get; set; }
    }

    public class BlockListResources
    {
        public BlockItem BlockItemRes { get; set; }
        public string FormatSelected { get; set; }
        public string LblAddBlock { get; set; }
        public string LblEmptyBlock { get; set; }
        public string LblName { get; set; }
        public string LblNewSearch { get; set; }
        public string LblNoResults { get; set; }
        public string LblRecent { get; set; }
        public string LblRetrieveAll { get; set; }
        public string LblSortBy { get; set; }
    }
}