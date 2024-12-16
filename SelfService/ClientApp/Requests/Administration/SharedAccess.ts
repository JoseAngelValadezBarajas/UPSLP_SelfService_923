/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: SharedAccess.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const SharedAccessRequests = {
    getSharedAccess(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSharedAccess.name, `/Settings/SharedAccess`, resolver, resolveError);
    },
    postSharedAccess(applyPrimaryEmail: boolean, daysInvitationExpires: number, defaultEmailType:number, disclosureStatement: string, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSharedAccess.name, `/Settings/SharedAccess`,
            {
                applyPrimaryEmail,
                daysInvitationExpires,
                defaultEmailType,
                disclosureStatement
            },
            resolver, resolveError);
    },
};

// Export object with the requests
export default SharedAccessRequests;