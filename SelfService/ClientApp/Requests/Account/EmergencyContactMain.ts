/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: EmergencyContactMain.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPeopleEmergency } from '../../Types/Account/IPeopleEmergency';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const EmergencyContactMainRequests = {
    getEmailRegExp(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getEmailRegExp.name, '/Settings/EmailRegExp', null, resolver, resolveError);
    },
    getEmergencyContacts(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getEmergencyContacts.name, '/EmergencyContacts', null, resolver, resolveError);
    },
    getOptions(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getOptions.name, '/EmergencyContacts/Options', null, resolver, resolveError);
    },
    saveEmergencyContacts(peopleEmergency: IPeopleEmergency, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.saveEmergencyContacts.name, '/EmergencyContacts/Save', peopleEmergency, resolver, resolveError);
    }
};

// Export object with the requests
export default EmergencyContactMainRequests;