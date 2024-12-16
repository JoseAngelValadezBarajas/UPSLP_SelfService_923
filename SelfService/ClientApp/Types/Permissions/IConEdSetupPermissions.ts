/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IConEdSetupPermissions.ts */

export interface IConEdSetupPermissions {
    conEdDefaults: boolean;
    conEdRegistration: boolean;
}

export enum ConEdSetupTabs {
    ConEdDefaults = 0,
    ConEdRegistration = 1
}