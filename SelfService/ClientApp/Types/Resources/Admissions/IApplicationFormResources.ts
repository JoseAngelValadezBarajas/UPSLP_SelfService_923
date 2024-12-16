/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IApplicationFormResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

export interface IAddressSearchModal {
    btnClear: string;
    btnSearch: string;
    lblCity: string;
    lblClear: string;
    lblCountry: string;
    lblCounty: string;
    lblNoResults: string;
    lblSearch: string;
    lblState: string;
    lblTitle: string;
    lblZipCode: string;
}

export interface IApplicationFormResources extends ILayoutResources {
    addressSearchModal: IAddressSearchModal;
    attachments: IAttachments;
    applicationHandler: IApplicationHandler;
    confirmationSavedModal: IConfirmationSavedModal;
    emailModal: IEmailModal;
    etsSearchModal: IETSSearchModal;
    formatDateOutOfRange: string;
    lblHeaderTitle: string;
    lblPageTitle: string;
    notAvailableModal: INotAvailableModal;
}

export interface IApplicationHandler {
    btnDelete: string;
    btnOk: string;
    formatCompleteStep: string;
    formatHasFee: string;
    formatHasFees: string;
    lblAddNew: string;
    lblAmount: string;
    lblAuthorizationCode: string;
    lblBack: string;
    lblContentTextApplication: string;
    lblDescription: string;
    lblNew: string;
    lblNext: string;
    lblNotAvailable: string;
    lblPrimary: string;
    lblReCaptchaRequired: string;
    lblSave: string;
    lblSearch: string;
    lblSelect: string;
    lblSubmit: string;
    lblTitleDetails: string;
}

export interface IAttachments {
    lblAcceptConfirmation: string;
    lblAllAttachmentsSizeError: string;
    lblAttachments: string;
    lblAttachmentsSizeError: string;
    lblCancelConfirmation: string;
    lblChooseFile: string;
    lblClose: string;
    lblContinue: string;
    lblDelete: string;
    lblInstructions: string;
    lblName: string;
    lblNoUploads: string;
    lblRemoveConfirmation: string;
    lblRemoveTitle: string;
    lblSize: string;
    lblSupportedFiles: string;
    lblSupportedFilesTitle: string;
    lblTitle: string;
    lblTotalAttachmentsError: string;
    lblTotalSize: string;
    lblType: string;
}

export interface IConfirmationSavedModal {
    btnOk: string;
    lblTitle: string;
}

export interface IEmailModal {
    lblEmailAddress: string;
    lblEmptyEmailAddress: string;
    lblEnterEmail: string;
    lblInvalidEmal: string;
    lblSave: string;
    lblSaveApplication: string;
    lblSaveApplicationEmptyEmailIns: string;
    lblSaveApplicationInstructions: string;
}

export interface IETSSearchModal {
    btnClear: string;
    btnSearch: string;
    lblCity: string;
    lblClear: string;
    lblCountry: string;
    lblEmptyOptionCountry: string;
    lblEmptyOptionState: string;
    lblETSCode: string;
    lblFICECode: string;
    lblInstitutionName: string;
    lblSearch: string;
    lblState: string;
    lblTitle: string;
}

export interface INotAvailableModal {
    lblNotAvailable: string;
    lblNotAvailableMessage: string;
    lblOk: string;
}