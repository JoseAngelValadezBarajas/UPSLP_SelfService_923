/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: IAdviseeSearch.ts */

import { IAdviseeSearchCriteria } from "./IAdviseeSearchCriteria";

export interface IAdviseeSearch extends IAdviseeSearchCriteria {
    filter?: number;
    isAdvancedSearch: boolean;
    keyword?: string;
    length?: number;
    overallCount?: number;
    sessionPeriodId?: number;
    startIndex?: number;
    view: number;
}