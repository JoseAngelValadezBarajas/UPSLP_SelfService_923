/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
* File: DisabilitiesMain.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Functions for requests
const DisabilitiesMainRequests = {
    getDisabilitiesInfo(impersonateInfo: IImpersonateInfo, resolver: (json: string) => void): void {
        Request.post(this.getDisabilitiesInfo.name, '/People/Disabilities', { impersonateInfo }, resolver);
    }
};

// Export object with the requests
export default DisabilitiesMainRequests;