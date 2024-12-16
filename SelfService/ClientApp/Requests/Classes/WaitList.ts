/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Waitlist.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const WaitlistRequests = {
    getWaitlist(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.getWaitlist.name, '/Sections/Waitlist', sectionId, resolver);
    },
    editStatusWaitlist(sectionId: number, personIds: number[], resolver: (json: string) => void): void {
        Request.post(this.editStatusWaitlist.name, '/Sections/EditStatusWaitlist', { sectionId, personIds }, resolver);
    }
};

// Export object with the requests
export default WaitlistRequests;