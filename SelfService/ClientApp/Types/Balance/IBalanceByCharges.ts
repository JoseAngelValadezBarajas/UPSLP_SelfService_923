/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IBalanceByCharges.ts */

// Types
import { IBalance } from './IBalance';
import { IChargeCredit } from './IChargeCredit';

export interface IBalanceByCharges extends IBalance {
    totalAmountCharges: string;
    charges: IChargeCredit[];
    totalAmountCredits: string;
    credits: IChargeCredit[];
    totalAmountFinancialAids: string;
    financialAids: IChargeCredit[];
}