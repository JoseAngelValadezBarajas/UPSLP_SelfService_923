// --------------------------------------------------------------------
// <copyright file="LayoutListResources.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class LayoutListResources
    {
        public SaveSettings LayoutListResorces { get; set; }
        public string LblAddForm { get; set; }
        public string LblApplicationStatus { get; set; }
        public string LblDescription { get; set; }
        public string LblFormName { get; set; }
        public string LblInstructions { get; set; }
        public string lblLayouts { get; set; }
        public string lblSave { get; set; }
        public string lblSaveOptionsTitle { get; set; }
        public string LblShowApplicationStatus { get; set; }
        public string LblShowDecisionAdmit { get; set; }
    }

    public class SaveSettings
    {
        public string LblConfirmationMessage { get; set; }
        public string LblEdit { get; set; }
        public string LblEditLink { get; set; }
        public string LblEnableSave { get; set; }
        public string lblEnterConfirmationMsj { get; set; }
        public string lblEnterSaveMessage { get; set; }
        public string lblEnterText { get; set; }
        public string LblSaveButton { get; set; }
        public string LblSaveMessage { get; set; }
        public string LblSaveSettingsTitle { get; set; }
    }
}