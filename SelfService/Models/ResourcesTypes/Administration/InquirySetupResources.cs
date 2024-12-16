// --------------------------------------------------------------------
// <copyright file="InquirySetupResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class InqAddComponentModalResources
    {
        public string BtnAccept { get; set; }
        public string BtnDecline { get; set; }
        public string BtnRemove { get; set; }
        public string BtnSave { get; set; }
        public string LblAddComponent { get; set; }
        public string LblButton { get; set; }
        public string lblConfirmationDialogTitle { get; set; }
        public string LblDivider { get; set; }
        public string LblEmailLink { get; set; }
        public string LblEnterComponent { get; set; }
        public string LblHtmlElement { get; set; }
        public string LblImage { get; set; }
        public string lblMessage { get; set; }
        public string LblPhoneLink { get; set; }
        public string LblSelect { get; set; }
        public string LblText { get; set; }
        public string LblTitle { get; set; }
        public string LblUserDefined { get; set; }
    }

    public class InqAddOptionsModalResources
    {
        public string BtnSave { get; set; }
        public string LblDescription { get; set; }
        public string LblEnterDescription { get; set; }
        public string LblEnterValue { get; set; }
        public string LblTitle { get; set; }
        public string LblValue { get; set; }
    }

    public class InqExtraComponentSetupResources
    {
        public string LblAlt { get; set; }
        public string LblEnterAlt { get; set; }
        public string LblEnterId { get; set; }
        public string LblEnterSrc { get; set; }
        public string LblEnterValue { get; set; }
        public string LblId { get; set; }
        public string LblSrc { get; set; }
        public string LblValue { get; set; }
    }

    public class InqFieldGroupSetupResources
    {
        public string BtnSave { get; set; }
        public string LblDefault { get; set; }
        public string LblDown { get; set; }
        public string LblEdit { get; set; }
        public string LblExtraLarge { get; set; }
        public string LblExtraSmall { get; set; }
        public string LblGridSize { get; set; }
        public string LblGridSizeRequired { get; set; }
        public string LblInstructions { get; set; }
        public string LblLabel { get; set; }
        public string LblLabelRequired { get; set; }
        public string LblLarge { get; set; }
        public string LblMaxAllowed { get; set; }
        public string lblMaxAllowMsgError { get; set; }
        public string LblMedium { get; set; }
        public string LblSelect { get; set; }
        public string LblSmall { get; set; }
        public string LblTitle { get; set; }
        public string LblUp { get; set; }
        public string lblValidatorDup { get; set; }
        public string lblValidatorDupMsgError { get; set; }
        public string LblValidatorInvalidFormat { get; set; }
        public string LblValidatorInvFormatError { get; set; }
        public string LblValidatorNotNumeric { get; set; }
        public string LblValidatorNotNumError { get; set; }
        public string LblValidatorNotValid { get; set; }
        public string LblValidatorNotValidError { get; set; }
        public string LblValidatorOutRange { get; set; }
        public string LblValidatorOutRangeError { get; set; }
        public string LblValidatorReqMsgError { get; set; }
        public string LblValidatorRequired { get; set; }
    }

    public class InqNameSetupResources
    {
        public string BtnSave { get; set; }
        public string LblDescription { get; set; }
        public string lblDescriptionIsRequired { get; set; }
        public string LblName { get; set; }
        public string lblNameDuplicated { get; set; }
        public string LblNameIsRequired { get; set; }
        public string LblTitle { get; set; }
    }

    public class InqSendToModalResources
    {
        public string BtnSave { get; set; }
        public string LblSelect { get; set; }
        public string LblSendToStep { get; set; }
        public string LblTitle { get; set; }
    }

    public class InqSetupHandlerResources
    {
        public string BtnSave { get; set; }
        public string LblAddNewComponent { get; set; }
        public string LblAddNewStep { get; set; }
        public string LblConfirmationDialog { get; set; }
        public string LblDown { get; set; }
        public string LblEdit { get; set; }
        public string LblFooter { get; set; }
        public string LblSendTo { get; set; }
        public string LblUp { get; set; }
    }

    public class InqSetupStepModalResources
    {
        public string BtnSave { get; set; }
        public string LblConfirmationDialog { get; set; }
        public string LblStepTitle { get; set; }
        public string LblTitle { get; set; }
    }

    public class InqTextSetupResources
    {
        public string LblActionUrl { get; set; }
        public string LblActionUrlInstructions { get; set; }
        public string LblColor { get; set; }
        public string LblDefault { get; set; }
        public string LblEnterColor { get; set; }
        public string LblEnterId { get; set; }
        public string LblEnterLabel { get; set; }
        public string LblEnterTextSize { get; set; }
        public string LblError { get; set; }
        public string LblH1 { get; set; }
        public string LblH2 { get; set; }
        public string LblH3 { get; set; }
        public string LblH4 { get; set; }
        public string LblId { get; set; }
        public string LblIsWithLink { get; set; }
        public string LblLabel { get; set; }
        public string LblLabelInstructions { get; set; }
        public string LblPrimary { get; set; }
        public string LblSecondary { get; set; }
        public string LblSelect { get; set; }
        public string LblTextSize { get; set; }
    }

    public class InquirySetupResources : LayoutResources
    {
        public InqAddComponentModalResources inqAddComponentModalResources { get; set; }
        public InqAddOptionsModalResources inqAddOptionsModalResources { get; set; }
        public InqExtraComponentSetupResources inqExtraComponentSetupResources { get; set; }
        public InqFieldGroupSetupResources inqFieldGroupSetupResources { get; set; }
        public InqNameSetupResources inqNameSetupResources { get; set; }
        public InqSendToModalResources inqSendToModalResources { get; set; }
        public InqSetupHandlerResources inqSetupHandlerResources { get; set; }
        public InqSetupStepModalResources inqSetupStepModalResources { get; set; }
        public InqTextSetupResources inqTextSetupResources { get; set; }
        public InqUserDefinedSetupResources inqUserDefinedSetupResources { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
    }

    public class InqUserDefinedSetupResources
    {
        public string BtnAddOptions { get; set; }
        public string LblCheckbox { get; set; }
        public string LblCustomScript { get; set; }
        public string LblCustomScriptInstructions { get; set; }
        public string LblDataType { get; set; }
        public string LblDatePicker { get; set; }
        public string LblDropdown { get; set; }
        public string LblEnterDataType { get; set; }
        public string LblEnterId { get; set; }
        public string LblEnterLabel { get; set; }
        public string LblEnterType { get; set; }
        public string lblGridSize { get; set; }
        public string lblGridSizeRequired { get; set; }
        public string LblId { get; set; }
        public string LblIsRequired { get; set; }
        public string LblIsUploading { get; set; }
        public string LblLabel { get; set; }
        public string LblMaxLength { get; set; }
        public string LblRemove { get; set; }
        public string LblSelect { get; set; }
        public string lblTextField { get; set; }
        public string LblType { get; set; }
        public string LblValidatorMaxLength { get; set; }
        public string LblValidatorOutRange { get; set; }
        public string LblValidatorOutRangeError { get; set; }
        public string LblValidatorReqMsgError { get; set; }
        public string LblValidatorRequired { get; set; }
    }
}