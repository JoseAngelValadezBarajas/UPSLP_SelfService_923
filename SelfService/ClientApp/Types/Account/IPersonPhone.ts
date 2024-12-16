/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IPersonPhone.ts */

export interface IPersonPhone {
    countryId: number;
    description: string | null;
    doNotCallReasonId: number | null;
    format?: string;
    id: number;
    isPrimary: boolean;
    number: string;
    type: string;
    // UI
    countryIdModified: boolean;
    formattedNumber?: string;
    isDuplicated: boolean;
    numberModified: boolean;
    typeModified: boolean;
}