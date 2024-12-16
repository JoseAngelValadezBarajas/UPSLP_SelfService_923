/* Copyright 2019 -2021 Ellucian Company L.P. and its affiliates.
 * File: CompleteProfileModal.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IConEdProspect } from '../../Types/Account/IProspect';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const CompleteProfileModalRequests = {
    getConEdData(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getConEdData.name, '/Prospect/ConEdData', null, resolver, resolveError);
    },
    postCreateConEd(prospect: IConEdProspect,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postCreateConEd.name, '/Prospect/CreateConEd', prospect, resolver, resolveError);
    }
};

// Export object with the requests
export default CompleteProfileModalRequests;