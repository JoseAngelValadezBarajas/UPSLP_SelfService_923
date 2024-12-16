/* Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
 * File: IAdviseeBasicSearch.ts */

export interface IAdviseeBasicSearch {
    keyword: string;
    length: number;
    sessionPeriodId?: number;
    startIndex: number;
    view: number;
}