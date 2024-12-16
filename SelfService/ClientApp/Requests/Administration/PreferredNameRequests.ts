/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: PreferredRequests.ts */

// Types
import { INotificationRequest } from '../../Types/Account/INotificationRequest';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const PreferredRequests = {
    getPreferredInfo(personId: number, resolver: (json: string) => void): void {
        Request.post(this.getPreferredInfo.name, '/People/GenderIdentity', personId, resolver);
    },
    getRequests(resolver: (json: string) => void): void {
        Request.post(this.getRequests.name, '/PreferredNames', null, resolver);
    },
    postApproveRequest(requestId: number, resolver: (json: string) => void): void {
        Request.post(this.postApproveRequest.name, '/PreferredNames/Approve', requestId, resolver);
    },
    postDenyRequest(requestId: number, resolver: (json: string) => void): void {
        Request.post(this.postDenyRequest.name, '/PreferredNames/Deny', requestId, resolver);
    },
    postSendNotification(notificationRequest: INotificationRequest, resolver: (json: string) => void): void {
        Request.post(this.postSendNotification.name, '/PreferredNames/CreatePreferredNameNotification', notificationRequest, resolver);
    }
};

// Export object with the requests
export default PreferredRequests;