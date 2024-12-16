/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IApplicationAddress.ts */

export interface IApplicationAddress {
    type?: number;
    line1?: string;
    line2?: string;
    line3?: string;
    line4?: string;
    houseNumber?: string;
    city?: string;
    stateProvince?: number;
    postalCode?: string;
    country?: number;
    county?: number;
    isPrimary: boolean;
}