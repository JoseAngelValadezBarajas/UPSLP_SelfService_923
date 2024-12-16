/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IApprovalRequest.ts */

export interface IApprovalRequest {
    decision: number;
    reason: string;
    scheduleRequestId?: number;
}