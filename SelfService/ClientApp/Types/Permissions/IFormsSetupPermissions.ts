/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IFormsSetupPermissions.ts */

export interface IFormsSetupPermissions {
    applicationFormsSetup: boolean;
    inquiryFormSetup: boolean;
}

export enum FormsSetupTabs {
    ApplicationFormsSetup = 0,
    InquiryFormSetup = 1
}