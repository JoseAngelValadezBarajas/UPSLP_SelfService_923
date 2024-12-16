/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IAdviseeAdvancedSearch.ts */

import { IAdviseeSearchCriteria } from "./IAdviseeSearchCriteria";

export interface IAdviseeAdvancedSearch {
    criteria: IAdviseeSearchCriteria;
    filter: number;
    length: number;
    sessionPeriodId?: number;
    startIndex: number;
    view: number;
}