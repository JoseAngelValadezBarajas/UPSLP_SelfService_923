/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPeriodFilter.ts */

export interface IPeriodFilter {
    id: number;
    isIncluded: boolean;
    isRelatedIncluded: boolean;
    session: string;
    term: string;
}