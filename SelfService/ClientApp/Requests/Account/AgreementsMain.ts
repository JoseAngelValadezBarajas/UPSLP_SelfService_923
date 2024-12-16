/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
* File: AgreementsMain.ts */

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AgreementsMainRequests = {
    getAgreementDetail(id: number, resolver: (json: string) => void): void {
        Request.post(this.getAgreementDetail.name, '/People/AgreementDetail', id, resolver);
    },
    postGetAgreements( startIndex: number, length: number, resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.postGetAgreements.name, '/People/Agreements', { impersonateInfo, startIndex, length }, resolver);
    }
};

// Export object with the requests
export default AgreementsMainRequests;