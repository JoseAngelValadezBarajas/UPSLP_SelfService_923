/* Copyright 2023 Ellucian Company L.P. and its affiliates.
* File: RegistrationSummaryMain.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Functions for requests
const RegistrationSummaryMainRequests = {
    deleteRegistrationSummary(registrationLogId: number, resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.deleteRegistrationSummary.name, '/Students/DeleteRegistrationLog', { registrationLogId, impersonateInfo }, resolver);
    },
    getRegistrationSummary(id: number, resolver: (json: string) => void): void {
        Request.post(this.getRegistrationSummary.name, '/Students/RegistrationSummary', id, resolver);
    },
    getRegistrationSummaryByPerson(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getRegistrationSummaryByPerson.name, '/Students/RegistrationSummaryByPerson', { impersonateInfo }, resolver);
    }
};

// Export object with the requests
export default RegistrationSummaryMainRequests;