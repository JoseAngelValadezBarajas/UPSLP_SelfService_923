/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IRegistrationGroupDetail.ts */

// Types
import { IRegistrationGroup } from './IRegistrationGroup';

export interface IRegistrationGroupDetail extends IRegistrationGroup {
    advisorApprovalRequired: boolean;
    authorizationRequired: boolean;
    dropApprovalRequired: boolean;
    endOffset?: string;
    endRegistrationDate: string;
    endRegistrationHour: number | null;
    endRegistrationMinute: number | null;
    endRegistrationType: string;
    groupViewName: string;
    startOffset?: string;
    startRegistrationDate: string;
    startRegistrationHour: number | null;
    startRegistrationMinute: number | null;
    startRegistrationType: string;
    // UI validations
    nameOriginal: string;
    sortOriginal: string;
}