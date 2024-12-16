/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: SystemInformation.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const SystemInformationRequests = {
    getSystemInformation(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSystemInformation.name, '/Settings/SystemInformation', resolver, resolveError);
    }
};

export default SystemInformationRequests;