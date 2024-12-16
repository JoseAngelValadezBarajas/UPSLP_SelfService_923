/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IProfilePermissions.ts */

export interface IProfilePermissions {
    account: boolean;
    addresses: boolean;
    agreements: boolean;
    changePassword: boolean;
    demographic: boolean;
    emergencyContacts: boolean;
    ethnicityAndRace: boolean;
    phoneNumbers: boolean;
    preferredName: boolean;
    profile: boolean;
    sharedAccess: boolean;
    registrationSummary: boolean;
}

export enum ProfileTabs {
    Profile = 0,
    Account = 1,
    Addresses = 2,
    PhoneNumbers = 3,
    EmergencyContacts = 4,
    PreferredName = 5,
    Demographic = 6,
    EthnicityAndRace = 7,
    Agreements = 8,
    SharedAccess = 9,
    RegistrationSummary = 10
}