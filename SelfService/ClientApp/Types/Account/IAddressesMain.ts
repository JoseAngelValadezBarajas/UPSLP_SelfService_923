/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAddressesMain.ts */

// Types

export interface IAddressesMain {
    addressTypesExist: boolean;
    allowChange: boolean;
    approvalRequired: boolean;
    profileAddress: IProfileAddress[];
}

export interface IProfileAddress {
    addresses: IAddressInformation[];
    typeDesc: string;
    typeId: number;
}

export interface IAddressInformation {
    activeDate: string;
    addressApprovalRequestId?: number;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    addressLine5: string;
    approvedStatus: number;
    effectiveDate: string;
    houseNumber: string;
    isCurrentAddress: boolean;
    isPreferred: boolean;
    sequenceNumber?: number;
}