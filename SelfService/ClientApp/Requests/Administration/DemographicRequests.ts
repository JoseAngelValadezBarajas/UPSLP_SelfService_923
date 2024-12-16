/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: DemographicRequests.ts */

// Types
import { INotificationRequest } from '../../Types/Account/INotificationRequest';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const DemographicRequests = {
    getDemographicInfo(personId: number, resolver: (json: string) => void): void {
        Request.post(this.getDemographicInfo.name, '/People/Demographic', personId, resolver);
    },
    getRequests(resolver: (json: string) => void): void {
        Request.post(this.getRequests.name, '/Demographic', null, resolver);
    },
    postApproveRequest(demographicFormId: number, resolver: (json: string) => void): void {
        Request.post(this.postApproveRequest.name, '/Demographic/Requests/Approve', demographicFormId, resolver);
    },
    postDenyRequest(demographicFormId: number, resolver: (json: string) => void): void {
        Request.post(this.postDenyRequest.name, '/Demographic/Requests/Deny', demographicFormId, resolver);
    },
    postSendNotification(notificationRequest: INotificationRequest, resolver: (json: string) => void): void {
        Request.post(this.postSendNotification.name, '/Demographic/Requests/CreateNotification', notificationRequest, resolver);
    }
};

// Export object with the requests
export default DemographicRequests;