// --------------------------------------------------------------------
// <copyright file="CampaignsResources.cs" company="Ellucian">
//     Copyright 2020 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class AddCampaignResources
    {
        public string BtnAdd { get; set; }
        public string BtnCancel { get; set; }
        public string LblAddCampaign { get; set; }
        public string LblCampaign { get; set; }
        public string LblSelectCampaign { get; set; }
        public string LblUniqueCampaign { get; set; }
    }

    public class CampaignsResources
    {
        public AddCampaignResources AddCampaign { get; set; }
        public CampaignsTableResources CampaignsTable { get; set; }
        public ConfirmationDialogResources DeleteCampaignConfirmation { get; set; }
        public string LblEmptyState { get; set; }
        public string LblInstructions { get; set; }
        public string LblWarningUrl { get; set; }
    }

    public class CampaignsTableResources
    {
        public string BtnAdd { get; set; }
        public string LblEmptyCampaigns { get; set; }
        public string LblName { get; set; }
        public string LblRemove { get; set; }
    }
}