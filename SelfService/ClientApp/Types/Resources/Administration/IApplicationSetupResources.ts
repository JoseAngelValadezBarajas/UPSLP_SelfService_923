/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IApplicationSetupResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

export interface IApplicationSetupResources extends ILayoutResources {
    lblHeaderTitle: string;
    lblPageTitle: string;
    appSetupHandlerResources: IAppSetupHandlerResProps;
    appNameSetupResources: IAppNameSetupResources;
    appSendToModalResources: IAppSendToModalResources;
    appSetupStepModalResources: IAppSetupStepModalResources;
    appFieldGroupSetupResources: IAppFieldGroupSetupResources;
    appAddComponentModalResources: IAppAddComponentModalResources;
    appUserDefinedSetupResources: IAppUserDefinedSetupResources;
    appAddOptionsModalResources: IAppAddOptionsModalResources;
    appTextSetupResources: IAppTextSetupResources;
    appExtraComponentSetupResources: IAppExtraComponentSetupResources;
}

export interface IAppSetupHandlerResProps {
    btnSave: string;
    lblAddNewComponent: string;
    lblAddNewStep: string;
    lblConfirmationDialog: string;
    lblDown: string;
    lblEdit: string;
    lblFooter: string;
    lblSendTo: string;
    lblUp: string;
}

export interface IAppNameSetupResources {
    btnSave: string;
    lblDescription: string;
    lblDescriptionIsRequired: string;
    lblName: string;
    lblNameDuplicated: string;
    lblNameIsRequired: string;
    lblTitle: string;
}

export interface IAppSendToModalResources {
    btnSave: string;
    lblSelect: string;
    lblSendToStep: string;
    lblTitle: string;
}

export interface IAppSetupStepModalResources {
    btnSave: string;
    lblConfirmationDialog: string;
    lblStepTitle: string;
    lblTitle: string;
}

export interface IAppFieldGroupSetupResources {
    btnSave: string;
    lblDefault: string;
    lblDown: string;
    lblEdit: string;
    lblExtraLarge: string;
    lblExtraSmall: string;
    lblGridSize: string;
    lblGridSizeRequired: string;
    lblInstructions: string;
    lblLabel: string;
    lblLabelRequired: string;
    lblLarge: string;
    lblMaxAllowed: string;
    lblMaxAllowMsgError: string;
    lblMedium: string;
    lblSelect: string;
    lblSmall: string;
    lblTitle: string;
    lblUp: string;
    lblValidatorDup: string;
    lblValidatorDupMsgError: string;
    lblValidatorInvalidFormat: string;
    lblValidatorInvFormatError: string;
    lblValidatorNotNumeric: string;
    lblValidatorNotNumError: string;
    lblValidatorNotValid: string;
    lblValidatorNotValidError: string;
    lblValidatorOutRange: string;
    lblValidatorOutRangeError: string;
    lblValidatorReqMsgError: string;
    lblValidatorRequired: string;
}

export interface IAppAddComponentModalResources {
    btnAccept: string;
    btnDecline: string;
    btnRemove: string;
    btnSave: string;
    lblAddComponent: string;
    lblButton: string;
    lblConfirmationDialogTitle: string;
    lblDivider: string;
    lblEnterComponent: string;
    lblEmailLink: string;
    lblHtmlElement: string;
    lblImage: string;
    lblMessage: string;
    lblPhoneLink: string;
    lblSelect: string;
    lblText: string;
    lblTitle: string;
    lblUserDefined: string;
}

export interface IAppUserDefinedSetupResources {
    btnAddOptions: string;
    lblCheckbox: string;
    lblCustomScript: string;
    lblCustomScriptInstructions: string;
    lblDataType: string;
    lblDatePicker: string;
    lblDropdown: string;
    lblEnterDataType: string;
    lblEnterId: string;
    lblEnterLabel: string;
    lblEnterType: string;
    lblGridSize: string;
    lblGridSizeRequired: string;
    lblId: string;
    lblIsRequired: string;
    lblIsUploading: string;
    lblLabel: string;
    lblMaxLength: string;
    lblRemove: string;
    lblSelect: string;
    lblTextField: string;
    lblType: string;
    lblValidatorMaxLength: string;
    lblValidatorOutRange: string;
    lblValidatorOutRangeError: string;
    lblValidatorReqMsgError: string;
    lblValidatorRequired: string;
}

export interface IAppAddOptionsModalResources {
    btnSave: string;
    lblDescription: string;
    lblEnterDescription: string;
    lblEnterValue: string;
    lblTitle: string;
    lblValue: string;
}

export interface IAppTextSetupResources {
    lblActionUrl: string;
    lblActionUrlInstructions: string;
    lblColor: string;
    lblDefault: string;
    lblEnterColor: string;
    lblEnterId: string;
    lblEnterLabel: string;
    lblEnterTextSize: string;
    lblError: string;
    lblH1: string;
    lblH2: string;
    lblH3: string;
    lblH4: string;
    lblId: string;
    lblIsWithLink: string;
    lblLabel: string;
    lblLabelInstructions: string;
    lblPrimary: string;
    lblSecondary: string;
    lblTextSize: string;
    lblSelect: string;
}

export interface IAppExtraComponentSetupResources {
    lblAlt: string;
    lblEnterAlt: string;
    lblEnterId: string;
    lblEnterSrc: string;
    lblEnterValue: string;
    lblId: string;
    lblSrc: string;
    lblValue: string;
}