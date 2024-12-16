/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPeriodStatus.ts */

export interface IPeriodStatus {
    lastRegistrationDate: string;
    peopleAgreementStatus: boolean;
    preRegistrationDate: string;
    status: PeriodAuthorizationStatus;
    value: string;
}

export enum PeriodAuthorizationStatus {
    NoRegGroupFound,
    AdvisorAuthNeeded,
    PeriodEnded,
    NoAdvisorAssigned,
    PeriodNotOpen,
    PeriodNotOpenAuthNeeded,
    RegistrationAuthorized
}