/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IRequestTranscript.ts */

export interface IRequestTranscript {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    city: string;
    country: number;
    countryName: string;
    disclosureAccepted: boolean;
    houseNumber: string;
    name: string;
    numberCopies: string;
    postalCode: string;
    requestReason: string;
    stateProvince: number;
    stateProvinceName: string;
    totalAmount: number;
    // UI Validations
    invalidCopies: boolean;
    isAddressLine1Invalid: boolean;
    isCityInvalid: boolean;
    isCountryInvalid: boolean;
    isNameInvalid: boolean;
    isNumberCopiesInvalid: boolean;
    isPostalCodeInvalid: boolean;
    isRequestReasonInvalid: boolean;
    isStateProvinceInvalid: boolean;
}