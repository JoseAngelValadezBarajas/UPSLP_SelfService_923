/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
* File: PreferredNameMain.ts */

// Types
import { IPreferredNameSave } from '../../Types/Account/IPreferredNameSave';
import { INotificationRequest } from '../../Types/Account/INotificationRequest';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const PreferredNameMainRequests = {
    getNameInfo(resolver: (json: string) => void): void {
        Request.post(this.getNameInfo.name, '/People/GenderIdentity', null, resolver);
    },
    getOptions(resolver: (json: string) => void): void {
        Request.post(this.getOptions.name, '/People/GenderIdentity/Options', null, resolver);
    },
    postCancelRequest(requestId: number, resolver: (json: string) => void): void {
        Request.post(this.postCancelRequest.name, '/PreferredNames/Cancel', requestId, resolver);
    },
    postSavePreferredName(genderIdentity: IPreferredNameSave, resolver: (json: string) => void): void {
        Request.post(this.postSavePreferredName.name, '/People/GenderIdentity/Save', genderIdentity, resolver);
    },
    postSendNotification(typeRequest: number, resolver: (json: string) => void): void {
        const notificationRequest: INotificationRequest = {
            decision: '',
            personId: 0,
            type: typeRequest
        };
        Request.post(this.postSendNotification.name, '/PreferredNames/CreatePreferredNameNotification', notificationRequest, resolver);
    }
};

// Export object with the requests
export default PreferredNameMainRequests;