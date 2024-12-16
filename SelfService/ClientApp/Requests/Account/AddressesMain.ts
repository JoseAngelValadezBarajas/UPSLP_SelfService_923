/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
* File: AddressesMain.ts */

// Types
import { IAddressDetail } from '../../Types/Account/IAddressDetail';
import { INotificationRequest } from '../../Types/Account/INotificationRequest';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AddressesMainRequests = {
    deleteAddress(sequenceNumber: number, resolver: (json: string) => void): void {
        Request.post(this.deleteAddress.name, '/Address/Delete', sequenceNumber, resolver);
    },
    getAddressesInformation(resolver: (json: string) => void, personId?: number): void {
        Request.post(this.getAddressesInformation.name, '/Address/List', personId, resolver);
    },
    getAddressOptions(resolver: (json: string) => void): void {
        Request.post(this.getAddressOptions.name, '/Address/Options', null, resolver);
    },
    getAddressDetails(sequenceNumber: number, resolver: (json: string) => void): void {
        Request.post(this.getAddressDetails.name, '/Address/Details', sequenceNumber, resolver);
    },
    saveAddress(address: IAddressDetail, resolver: (json: string) => void): void {
        Request.post(this.saveAddress.name, '/Address/Save', address, resolver);
    },
    savePreferred(addressTypeId: number, sequenceNumber: number, resolver: (json: string) => void): void {
        Request.post(this.savePreferred.name, '/Address/Preferred/Save', { addressTypeId, sequenceNumber }, resolver);
    },
    postSendNotification(typeRequest: number, resolver: (json: string) => void): void {
        const notificationRequest: INotificationRequest = {
            decision: '',
            personId: 0,
            type: typeRequest
        };
        Request.post(this.postSendNotification.name, '/Address/ChangeRequest/Notification', notificationRequest, resolver);
    }
};

// Export object with the requests
export default AddressesMainRequests;