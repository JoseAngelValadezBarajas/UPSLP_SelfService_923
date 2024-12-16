/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IFinancialAid.ts */

import { IFinancialAidAwards } from './IFinancialAidAwards';
import { IFinancialAidDocuments } from './IFinancialAidDocuments';
import { IFinancialAidLoans } from './IFinancialAidLoans';
import { IFinancialAidPackaging } from './IFinancialAidPackaging';

export interface IFinancialAid {
    awardTerms: IFinancialAidAwards[];
    displayUnmetNeed: string;
    documents: IFinancialAidDocuments[];
    loans: IFinancialAidLoans[];
    messages: string[];
    packaging: IFinancialAidPackaging[];
}