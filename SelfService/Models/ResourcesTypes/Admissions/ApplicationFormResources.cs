// --------------------------------------------------------------------
// <copyright file="ApplicationFormResources.cs" company="Ellucian">
//     Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using SelfService.Models.ResourcesTypes.Generic;

namespace SelfService.Models.ResourcesTypes.Admissions
{
    public class AddressSearchModal
    {
        public string BtnClear { get; set; }
        public string BtnSearch { get; set; }
        public string LblCity { get; set; }
        public string LblClear { get; set; }
        public string LblCountry { get; set; }
        public string LblCounty { get; set; }
        public string lblNoResults { get; set; }
        public string LblSearch { get; set; }
        public string LblState { get; set; }
        public string LblTitle { get; set; }
        public string LblZipCode { get; set; }
    }

    public class ApplicationFormResources : LayoutResources
    {
        public AddressSearchModal AddressSearchModal { get; set; }
        public ApplicationHandler ApplicationHandler { get; set; }
        public Attachments Attachments { get; set; }
        public ConfirmationSavedModal ConfirmationSavedModal { get; set; }
        public EmailModal EmailModal { get; set; }
        public EtsSearchModal EtsSearchModal { get; set; }
        public string FormatDateOutOfRange { get; set; }
        public string LblHeaderTitle { get; set; }
        public string LblPageTitle { get; set; }
        public NotAvailableModal NotAvailableModal { get; set; }
    }

    public class ApplicationHandler
    {
        public string BtnDelete { get; set; }
        public string BtnOk { get; set; }
        public string FormatCompleteStep { get; set; }
        public string FormatHasFee { get; set; }
        public string FormatHasFees { get; set; }
        public string LblAddNew { get; set; }
        public string LblAmount { get; set; }
        public string LblAuthorizationCode { get; set; }
        public string LblBack { get; set; }
        public string LblContentTextApplication { get; set; }
        public string LblDescription { get; set; }
        public string LblNew { get; set; }
        public string LblNext { get; set; }
        public string LblNotAvailable { get; set; }
        public string LblPrimary { get; set; }
        public string LblReCaptchaRequired { get; set; }
        public string LblSave { get; set; }
        public string LblSearch { get; set; }
        public string LblSelect { get; set; }
        public string LblSubmit { get; set; }
        public string LblTitleDetails { get; set; }
    }

    public class Attachments
    {
        public string LblAcceptConfirmation { get; set; }
        public string LblAllAttachmentsSizeError { get; set; }
        public string LblAttachments { get; set; }
        public string LblAttachmentsSizeError { get; set; }
        public string lblCancelConfirmation { get; set; }
        public string LblChooseFile { get; set; }
        public string LblClose { get; set; }
        public string LblContinue { get; set; }
        public string LblDelete { get; set; }
        public string LblInstructions { get; set; }
        public string LblName { get; set; }
        public string LblNoUploads { get; set; }
        public string LblRemoveConfirmation { get; set; }
        public string LblRemoveTitle { get; set; }
        public string LblSize { get; set; }
        public string LblSupportedFiles { get; set; }
        public string LblSupportedFilesTitle { get; set; }
        public string LblTitle { get; set; }
        public string LblTotalAttachmentsError { get; set; }
        public string LblTotalSize { get; set; }
        public string LblType { get; set; }
    }

    public class ConfirmationSavedModal
    {
        public string BtnOk { get; set; }
        public string LblTitle { get; set; }
    }

    public class EmailModal
    {
        public string LblEmailAddress { get; set; }
        public string lblEmptyEmailAddress { get; set; }
        public string LblEnterEmail { get; set; }
        public string LblInvalidEmal { get; set; }
        public string LblSave { get; set; }
        public string LblSaveApplication { get; set; }
        public string lblSaveApplicationEmptyEmailIns { get; set; }
        public string LblSaveApplicationInstructions { get; set; }
    }

    public class EtsSearchModal
    {
        public string BtnClear { get; set; }
        public string BtnSearch { get; set; }
        public string LblCity { get; set; }
        public string LblClear { get; set; }
        public string LblCountry { get; set; }
        public string LblEmptyOptionCountry { get; set; }
        public string LblEmptyOptionState { get; set; }
        public string LblETSCode { get; set; }
        public string LblFICECode { get; set; }
        public string LblInstitutionName { get; set; }
        public string LblSearch { get; set; }
        public string LblState { get; set; }
        public string LblTitle { get; set; }
    }

    public class NotAvailableModal
    {
        public string lblNotAvailable { get; set; }
        public string lblNotAvailableMessage { get; set; }
        public string lblOk { get; set; }
    }
}