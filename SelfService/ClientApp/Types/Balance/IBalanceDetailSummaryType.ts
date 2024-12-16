/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IBalanceDetailSummaryType.ts */

// Types
import { IChargeCredit } from './IChargeCredit';

export interface IBalanceDetailSummaryType {
    type: string;
    description: string;
    totalAmount: string;
    charges: IChargeCredit[];
}