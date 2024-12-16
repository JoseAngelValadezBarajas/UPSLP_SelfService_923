/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IBalance.ts */

export interface IBalance {
    periodSummaryTotal: string;
    periodAnticipatedFinAid: string;
    periodTotal: string;
    otherPeriodsBalance: string;
    otherPeriodsBalanceDue: string;
    otherPeriodsAnticipatedFinAid: string;
    otherPeriodsAnticipatedBalance: string;
    displayDueDate: boolean;
    displayEstimatedLateFees: boolean;
    includeAnticipatedAid: boolean;
}