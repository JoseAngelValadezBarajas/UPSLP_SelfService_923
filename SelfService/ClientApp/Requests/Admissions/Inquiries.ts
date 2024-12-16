/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: Inquiries.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const InquiriesRequests = {
    getInquiries(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getInquiries.name, '/Forms/List', 1 , resolver, resolveError);
    }
};

// Export object with the requests
export default InquiriesRequests;