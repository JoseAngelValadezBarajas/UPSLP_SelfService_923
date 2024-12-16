/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAgreements.ts */

// Types
import { IAgreement } from './IAgreement';

export interface IAgreements {
    agreementList: IAgreement[];
    overallCount: number;
}