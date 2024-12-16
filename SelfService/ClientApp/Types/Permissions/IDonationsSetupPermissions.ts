/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IDonationsSetupPermissions.ts */

export interface IDonationsSetupPermissions {
    campaigns: boolean;
    form: boolean;
    giftBatchDefaults: boolean;
}

export enum DonationsSetupTabs {
    Campaigns = 0,
    GiftBatchDefaults = 1,
    Form = 2,
}