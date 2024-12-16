/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IProspect.ts */

export interface IConEdProspect extends IProspect {
    sources: IProspectListItem[];
}

export interface IProspect {
    address: IProspectAddress;
    birthDateFormatted: string;
    displayName: string;
    firstName: string;
    governmentId: string;
    interests: IProspectListItem[];
    lastName: string;
    lastNamePrefix: string;
    middleName: string;
    phone: IProspectPhone;
    prefixId?: number;
    suffixId?: number;
}

export interface IProspectValidations {
    addressLine1Modified: boolean;
    addressTypeModified: boolean;
    cityModified: boolean;
    countryModified: boolean;
    firstNameModified: boolean;
    lastNameModified: boolean;
    phoneCountryModified: boolean;
    phoneNumberModified: boolean;
    phoneTypeModified: boolean;

    birthDateInvalid: boolean;
    governmentIdInvalid: boolean;
}

export interface IProspectAddress {
    city: string;
    countryId: number;
    houseNumber: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    zipCode: string;
    stateProvinceId?: number;
    type: number;
}

export interface IProspectListItem {
    description: string;
    id: number;
    isActive: boolean;
}

export interface IProspectPhone {
    countryId: number;
    number: string;
    type: string;
}