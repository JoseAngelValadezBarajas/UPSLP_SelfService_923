/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AlertReport.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

const AlertReportRequests = {
    getPeriods(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getPeriods.name, `/Periods/AlertsReport`, { impersonateInfo }, resolver);
    },
    getAlertsReport(termPeriodId: number, resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getAlertsReport.name, '/Students/AlertsReport', { termPeriodId, impersonateInfo }, resolver);
    }
};

// Export object with the requests
export default AlertReportRequests;