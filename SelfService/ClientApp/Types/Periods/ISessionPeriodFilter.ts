/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ISessionPeriodFilter.ts */

export interface ISessionPeriodFilter {
    id: number;
    isEnabled: boolean;
    isEnabledRelated: boolean;
    periodFilterId: number;
    relatedModified: boolean;
}