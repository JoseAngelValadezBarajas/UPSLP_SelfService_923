// --------------------------------------------------------------------
// <copyright file="BalanceResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Finances
{
    public class BalanceResources : LayoutResources
    {
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
    }
}