/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IRequestsSetupPermissions.ts */

export interface IRequestsSetupPermissions {
    addressRequests: boolean;
    demographicRequests: boolean;
    preferredNameRequests: boolean;
}

export enum RequestsSetupTabs {
    AddressRequests = 1,
    DemographicRequests = 0,
    PreferredNameRequests = 2
}