/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AgreementModal.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AgreementModalRequests = {
    postSaveAgreement(id: number, agreementId: number, yearTerm: string,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveAgreement.name, '/People/SaveAgreement',
            { id, agreementId, isAccepted: true, yearTerm }, resolver, resolveError);
    }
};

// Export object with the requests
export default AgreementModalRequests;