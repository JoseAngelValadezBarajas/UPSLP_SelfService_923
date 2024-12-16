/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
* File: DemographicMain.ts */

// Types
import { IDemographicSave } from '../../Types/Account/IDemographicSave';
import { INotificationRequest } from '../../Types/Account/INotificationRequest';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const DemographicMainRequests = {
    getDemographicInfo(resolver: (json: string) => void): void {
        Request.post(this.getDemographicInfo.name, '/People/Demographic', null, resolver);
    },
    getDemographicOptions(resolver: (json: string) => void): void {
        Request.post(this.getDemographicOptions.name, '/People/Demographic/Options', null, resolver);
    },
    postDeleteDemographicInformation(demographicFormId: number, resolver: (json: string) => void): void {
        Request.post(this.postDeleteDemographicInformation.name, '/Demographic/Requests/Delete', demographicFormId, resolver);
    },
    postSaveDemographicInformation(demographic: IDemographicSave, resolver: (json: string) => void): void {
        Request.post(this.postSaveDemographicInformation.name, '/People/Demographic/Save', demographic, resolver);
    },
    postSendNotification(typeRequest: number, resolver: (json: string) => void): void {
        const notificationRequest: INotificationRequest = {
            decision: '',
            personId: 0,
            type: typeRequest
        };
        Request.post(this.postSendNotification.name, '/Demographic/Requests/CreateNotification', notificationRequest, resolver);
    }
};

// Export object with the requests
export default DemographicMainRequests;