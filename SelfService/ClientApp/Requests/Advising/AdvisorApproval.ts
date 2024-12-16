/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AdvisorApproval.ts */

// Types
import { IApprovalRequest } from '../../Types/Advising/IApprovalRequest';
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AdvisorApprovalRequest = {
    getApprovalRequests(impersonateInfo: IImpersonateInfo, sessionPeriodId: number, resolver: (json: string) => void): void {
        Request.post(this.getApprovalRequests.name, '/Schedule/ApprovalRequests', { impersonateInfo, sessionPeriodId }, resolver);
    },
    getPeriods(resolver: (json: string) => void,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getPeriods.name, '/Periods/ScheduleRequests', { impersonateInfo }, resolver);
    },
    getRegistrationSummary(id: number, resolver: (json: string) => void): void {
        Request.post(this.getRegistrationSummary.name, '/Students/RegistrationSummary', id, resolver);
    },
    saveApprovalRequest(impersonateInfo: IImpersonateInfo,
        sessionPeriodId: number,
        approvalRequests: IApprovalRequest[],
        resolver: (json: string) => void): void {
        Request.post(this.saveApprovalRequest.name,
            '/Schedule/ApprovalRequests/Save',
            { impersonateInfo, sessionPeriodId, approvalRequests },
            resolver);
    },
    validateApprovalRequest(impersonateInfo: IImpersonateInfo,
        sessionPeriodId: number,
        approvalRequests: number[],
        resolver: (json: string) => void): void {
        Request.post(this.validateApprovalRequest.name,
            '/Schedule/ApprovalRequests/Validate',
            { impersonateInfo, sessionPeriodId, approvalRequests },
            resolver);
    }
};

// Export object with the requests
export default AdvisorApprovalRequest;