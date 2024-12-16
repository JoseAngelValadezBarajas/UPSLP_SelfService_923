/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IBalanceBySummary.ts */

// Types
import { IBalance } from './IBalance';
import { IBalanceSummary } from './IBalanceSummary';

export interface IBalanceBySummary extends IBalance {
    summaryTypes: IBalanceSummary[];
}