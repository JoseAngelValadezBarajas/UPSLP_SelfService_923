/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAddress.ts */

export interface IAddress {
    addLine1: string;
    addLine2: string;
    addLine3: string;
    addLine4: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    city: string;
    cityPrefix: string;
    citySuffix: string;
    country: string;
    countryId?: number;
    county: string;
    countyId?: number;
    houseNumber: string;
    overallCount: number;
    state: string;
    stateProvinceId?: number;
    type?: number;
    zipCode: string;
}