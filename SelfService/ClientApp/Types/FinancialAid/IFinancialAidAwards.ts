/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IFinancialAidAwards.ts */

import { IFinancialAidFunds } from './IFinancialAidFunds';

export interface IFinancialAidAwards {
    awardTermDescription: string;
    funds: IFinancialAidFunds[];
    totalActualAmountByTerm: string;
    totalScheduledAmountByTerm: string;
}