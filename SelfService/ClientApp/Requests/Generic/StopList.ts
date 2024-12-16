/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
* File: StopList.ts */

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const StopListRequests = {
    getStopList(resolver: (json: string) => void, signal: AbortSignal,
         impersonateInfo?: IImpersonateInfo): void {
         Request.post(this.getStopList.name, `/People/StopList`, { impersonateInfo }, resolver, signal);
    }
};

// Export object with the requests
export default StopListRequests;