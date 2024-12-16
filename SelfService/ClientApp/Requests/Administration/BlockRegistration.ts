/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: BlockRegistration.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const BlockRegistrationRequests = {
    getOptions(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getOptions.name, '/Periods/BlockRegistration', null, resolver, resolveError);
    }
};

// Export object with the requests
export default BlockRegistrationRequests;