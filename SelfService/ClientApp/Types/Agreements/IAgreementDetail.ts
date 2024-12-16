/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAgreementDetail.ts */

// Types
import { IAgreement } from './IAgreement';

export interface IAgreementDetail extends IAgreement {
    acceptance: string;
    agreementType: AgreementType;
    content: string;
    // UI validations
    nameOriginal: string;
}

export enum AgreementType {
    Registration = 0
}