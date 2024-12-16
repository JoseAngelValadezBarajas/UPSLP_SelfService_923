/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IBalanceBySummaryType.ts */

// Types
import { IBalance } from './IBalance';
import { IBalanceDetailSummaryType } from './IBalanceDetailSummaryType';

export interface IBalanceBySummaryType extends IBalance {
    detailSummaryTypes: IBalanceDetailSummaryType[];
}