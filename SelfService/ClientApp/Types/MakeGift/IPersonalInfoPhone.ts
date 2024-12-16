/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IPersonalInfoPhone.ts */

export interface IPersonalInfoPhone {
    countryId?: number;
    description: string;
    format: string;
    formattedPhone: string;
    isPrimary: boolean;
    number: string;
    phoneCountryModified: boolean;
    phoneNumberModified: boolean;
    phoneTypeModified: boolean;
    primaryValue: string;
    type: string;
}