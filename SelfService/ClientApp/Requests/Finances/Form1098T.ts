/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: Form1098T.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const BalanceRequests = {
    getAgreement(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getAgreement.name, '/Agreements/Form1098T', resolver, resolveError);
    },
    getTaxYears(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getTaxYears.name, '/TaxYearSettings/ForStudent', resolver, resolveError);
    },
    postSaveAgreement(id: number, agreementId: number, isAccepted: boolean,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void) {
        Request.post(this.postSaveAgreement.name, '/People/SaveAgreement',
            { id, agreementId, isAccepted, yearTerm: '' }, resolver, resolveError);
    }
};

// Export object with the requests
export default BalanceRequests;