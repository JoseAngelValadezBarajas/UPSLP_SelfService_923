/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IStopList.ts */

export interface IStopList {
    comments: string;
    date: string;
    isGradesStop: boolean;
    isRegistrationStop: boolean;
    reason: string;
}