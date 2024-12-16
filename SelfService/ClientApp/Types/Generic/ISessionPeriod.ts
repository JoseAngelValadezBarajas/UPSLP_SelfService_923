/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ISessionPeriod.ts */

export interface ISessionPeriod {
    id: number;
    hasPending: boolean;
    sessionCode: string;
    sessionDesc: string;
    sessionPeriodId: number;
    termCode: string;
    termDesc: string;
    year: string;
}