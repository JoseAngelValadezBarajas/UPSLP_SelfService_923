/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
* File: ProfileMain.ts */

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const ProfileMainRequests = {
    getProfileInformation(resolver: (json: string) => void,  impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getProfileInformation.name, `/Students/Academic`, { impersonateInfo }, resolver);
    },
    getAdviseeWarnings(resolver: (json: string) => void, signal: AbortSignal,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getAdviseeWarnings.name, `/Advisees/Warnings`, { impersonateInfo },resolver,  signal);
    }
};

// Export object with the requests
export default ProfileMainRequests;