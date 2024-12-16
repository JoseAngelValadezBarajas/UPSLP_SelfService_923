/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: FinancialAid.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const FinancialAidRequests = {
    getFinancialAidPeriods(resolver: (json: string) => void, resolveError: (logData: ILogData) => void, personId?: number): void {
        Request.get(this.getFinancialAidPeriods.name, `/Periods/FinancialAid/${personId}`, resolver, resolveError);
    },
    getFinancialAidInformation(awardYearToken: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void, personId?: number): void {
        Request.post(this.getFinancialAidInformation.name, '/Students/FinancialAids', { awardYearToken, personId }, resolver, resolveError);
    }
};

// Export object with the requests
export default FinancialAidRequests;