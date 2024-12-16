/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IFinancialAidPackaging.ts */

import { IFinancialAidAmountCategory } from './IFinancialAidAmountCategory';

export interface IFinancialAidPackaging {
    studentBudget: IFinancialAidAmountCategory[];
    studentFinancialAid: IFinancialAidAmountCategory[];
    studentNeed: IFinancialAidAmountCategory[];
}