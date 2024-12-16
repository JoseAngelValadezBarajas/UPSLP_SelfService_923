/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: IAddressRequests.ts */

// Types
import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { IAddressDetail } from '../Account/IAddressDetail';

export interface IAddressRequests {
    addressRequestList: IAddressRequestList[];
    overallCount: number;
}

export interface IAddressRequestList {
    addressApprovalRequestId: number;
    avatar: IAvatar;
    currentAddress: IAddressDetail;
    hasPicture: boolean;
    newAddress: IAddressDetail;
    peopleId: string;
    requestDate: string;
    // UI
    checked: boolean;
}

export interface IAddressRequestApproveModels {
    personId: number;
    requestId: number;
}