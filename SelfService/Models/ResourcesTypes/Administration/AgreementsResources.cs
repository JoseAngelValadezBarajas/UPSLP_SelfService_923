// --------------------------------------------------------------------
// <copyright file="AgreementsResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class AgreementsEdit
    {
        public string BtnCancel { get; set; }
        public string BtnDeactivate { get; set; }
        public string BtnPublish { get; set; }
        public string BtnSave { get; set; }
        public string FormatTitleEditing { get; set; }
        public string LblAcceptance { get; set; }
        public string LblAcceptanceRequired { get; set; }
        public string LblContent { get; set; }
        public string LblContentHelpText { get; set; }
        public string LblContentRequired { get; set; }
        public string LblName { get; set; }
        public string LblNameDuplicated { get; set; }
        public string LblNameRequired { get; set; }
        public string LblNotActive { get; set; }
        public string LblPreview { get; set; }
        public string LblPublished { get; set; }
        public string LblStatus { get; set; }
        public string LblTitle { get; set; }
        public string LblTitleRequired { get; set; }
    }

    public class AgreementsResources
    {
        public AgreementsEdit AgreementsEdit { get; set; }
        public string BtnAdd { get; set; }
        public string LblInstructions { get; set; }
        public string LblName { get; set; }
        public string LblNotActive { get; set; }
        public string LblPublished { get; set; }
        public string LblStatus { get; set; }
        public string LblTitle { get; set; }
        public PublishConfirmation PublishConfirmation { get; set; }
    }

    public class PublishConfirmation
    {
        public string BtnAccept { get; set; }
        public string BtnDecline { get; set; }
        public string FormatTitle { get; set; }
        public string LblContent { get; set; }
    }
}