/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Agreements.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { AgreementStatus, IAgreement } from '../../Types/Agreements/IAgreement';
import { AgreementType } from '../../Types/Agreements/IAgreementDetail';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AgreementsRequests = {
    getAgreement(id: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.get(this.getAgreement.name, `/Agreements/Details/${id}`, resolver, resolveError);
    },
    getAgreements(type: AgreementType, startIndex: number, length: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.get(this.getAgreements.name, `/Agreements/${type}/${startIndex}/${length}`, resolver, resolveError);
    },
    postPostSaveAgreement(agreementDetail: IAgreement, status: AgreementStatus,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        agreementDetail.status = status;
        Request.post(this.postPostSaveAgreement.name, '/Agreements/Save', agreementDetail, resolver, resolveError);
    },
    postPostStatus(id: number, status: AgreementStatus,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postPostStatus.name, '/Agreements/Status', { id, status }, resolver, resolveError);
    },
    postValidateName(name: string,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateName.name, '/Agreements/ValidateName', name, resolver, resolveError);
    }
};

// Export object with the requests
export default AgreementsRequests;