/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
* File: PhoneNumberMain.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPersonPhone } from '../../Types/Account/IPersonPhone';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const PhoneNumberMainRequests = {
    deletePhoneNumber(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.deletePhoneNumber.name, '/People/Phones/Delete', id, resolver, resolveError);
    },
    getPhoneDetails(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getPhoneDetails.name, '/People/Phones/Details', id, resolver, resolveError);
    },
    getPhoneOptions(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getPhoneOptions.name, '/People/Phones/Options', null, resolver, resolveError);
    },
    getPhones(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getPhones.name, '/People/Phones', null, resolver, resolveError);
    },
    savePhoneNumber(personPhone: IPersonPhone, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.savePhoneNumber.name, '/People/Phones/Save', personPhone, resolver, resolveError);
    },
    setPhoneNumberAsPrimary(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.setPhoneNumberAsPrimary.name, '/People/Phones/SetAsPrimary', id, resolver, resolveError);
    }
};

// Export object with the requests
export default PhoneNumberMainRequests;