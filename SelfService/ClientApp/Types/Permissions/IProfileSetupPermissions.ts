/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IProfileSetupPermissions.ts */

export interface IProfileSetupPermissions {
    addressSettings: boolean;
    demographicSettings: boolean;
    emergencyContactSettings: boolean;
    phoneNumberSettings: boolean;
    preferredNameSettings: boolean;
}

export enum ProfileSetupTabs {
    AddressSettings = 0,
    DemographicSettings = 1,
    PhoneNumberSettings = 2,
    EmergencyContactSettings = 3,
    PreferredNameSetting = 4
}