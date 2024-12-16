/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IRegistrationPeriodStatus.ts */

export interface IPeriodLongStatus {
    formatPeriodEnded: string;
    formatPeriodNotOpen: string;
    formatPeriodNotOpenAuthNeeded: string;
    lblAdvisorAuthNeeded: string;
    lblNoAdvisorAssigned: string;
    lblNoRegGroupFound: string;
    lblOnlySearch: string;
}

export interface IPeriodShortStatus {
    formatPeriodEnded: string;
    formatPeriodNotOpen: string;
    formatPeriodNotOpenAuthNeeded: string;
    lblAdvisorAuthNeeded: string;
    lblNoAdvisorAssigned: string;
    lblNoRegGroupFound: string;
}