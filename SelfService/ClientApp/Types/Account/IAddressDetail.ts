/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAddressDetail.ts */

export interface IAddressDetail {
    addressApprovalRequestId?: number;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    addressTypeDesc: string;
    addressTypeId: number;
    city: string;
    countryDesc: string;
    countryId?: number;
    effectiveDate: string;
    houseNumber: string;
    isPreferred: boolean;
    isRecurring: boolean;
    sequenceNumber?: number;
    stateDesc: string;
    stateProvinceId?: number;
    zipCode: string;
    // UI Props
    deleteAddressTypeDesc: string;
    isAddressLine1Invalid: boolean;
    isAddressTypeInvalid: boolean;
    isCityInvalid: boolean;
    isCountryInvalid: boolean;
    isEffectiveDateInvalid: boolean;
    isEffectiveDateEmtpy: boolean;
}