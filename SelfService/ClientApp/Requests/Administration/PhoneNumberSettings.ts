/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: PhoneNumberSettings.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPhoneNumberSettings } from '../../Types/InstitutionSettings/IPhoneNumberSettings';
import { IInstitutionSettingFilterModel } from '../../Types/InstitutionSettings/IInstitutionSettingFilterModel';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const PhoneNumberSettingsRequests = {
    getFilterSettings(filter: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getFilterSettings.name, '/Settings/Filter', filter, resolver, resolveError);
    },
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getSettings.name, '/Settings/PhoneNumber', null, resolver, resolveError);
    },
    postSaveFilterSettings(institutionSettingFilterModel: IInstitutionSettingFilterModel,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveFilterSettings.name, '/Settings/Filter/Save', institutionSettingFilterModel, resolver, resolveError);
    },
    postSaveSettings(phoneNumber: IPhoneNumberSettings,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/PhoneNumber/Save', phoneNumber, resolver, resolveError);
    }
};

// Export object with the requests
export default PhoneNumberSettingsRequests;