/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AddressRequests.ts */

// Types
import { IAddressDetail } from '../../Types/Account/IAddressDetail';
import { INotificationRequest } from '../../Types/Account/INotificationRequest';
import { IAddressRequestApproveModels } from '../../Types/Students/IAddressRequests';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AddressRequestsRequests = {
    deleteAddressRequest(addressApprovalRequestId: number, resolver: (json: string) => void): void {
        Request.post(this.deleteAddressRequest.name, '/Address/ChangeRequest/Delete', addressApprovalRequestId, resolver);
    },
    getAddressRequests(startIndex: number, length: number, filter: number, resolver: (json: string) => void): void {
        Request.post(this.getAddressRequests.name, '/Address/ChangeRequest/List', { startIndex, length, filter }, resolver);
    },
    getDeniedPendingRequestsExist(resolver: (json: string) => void): void {
        Request.post(this.getDeniedPendingRequestsExist.name, '/Address/DeniedPendingRequests/Exist', null, resolver);
    },
    denyAddressRequests(requestsId: number[], resolver: (json: string) => void): void {
        Request.post(this.denyAddressRequests.name, '/Address/ChangeRequest/Deny', requestsId, resolver);
    },
    approveAddressRequests(addressRequestApproveModels: IAddressRequestApproveModels[], resolver: (json: string) => void): void {
        Request.post(this.approveAddressRequests.name, '/Address/ChangeRequest/Approve', addressRequestApproveModels, resolver);
    },
    getAddressRequestDetails(addressApprovalRequestId: number, resolver: (json: string) => void): void {
        Request.post(this.getAddressRequestDetails.name, '/Address/ChangeRequest/Edit', addressApprovalRequestId, resolver);
    },
    saveAddressRequests(requestNumber: number, addressDetail: IAddressDetail, resolver: (json: string) => void, personId?: number): void {
        Request.post(this.saveAddressRequests.name, '/Address/ChangeRequest/Save', { requestNumber, personId, addressDetail }, resolver);
    },
    postSendNotification(notificationRequest: INotificationRequest, resolver: (json: string) => void): void {
        Request.post(this.postSendNotification.name, '/Address/ChangeRequest/Notification', notificationRequest, resolver);
    }
};

// Export object with the requests
export default AddressRequestsRequests;