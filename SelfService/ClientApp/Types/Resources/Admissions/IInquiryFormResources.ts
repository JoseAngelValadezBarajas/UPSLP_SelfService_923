/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IInquiryFormResources.ts */

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

export interface IInquiryFormResources extends ILayoutResources {
    addressSearchModal: IAddressSearchModal;
    applicationHandler: IApplicationHandler;
    etsSearchModal: IETSSearchModal;
    formatDateOutOfRange: string;
    lblHeaderTitle: string;
    lblPageTitle: string;
}

export interface IApplicationHandler {
    btnDelete: string;
    formatHasFee: string;
    formatHasFees: string;
    lblAddNew: string;
    lblBack: string;
    lblNew: string;
    lblNext: string;
    lblNotAvailable: string;
    lblPrimary: string;
    lblReCaptchaRequired: string;
    lblSave: string;
    lblSearch: string;
    lblSelect: string;
    lblSubmit: string;
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