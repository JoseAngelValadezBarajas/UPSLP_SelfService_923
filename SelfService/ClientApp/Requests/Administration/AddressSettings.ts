/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: AddressSettings.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IAddressSettingsGlobal } from '../../Types/InstitutionSettings/IAddressSettings';
import { IInstitutionSettingFilterModel } from '../../Types/InstitutionSettings/IInstitutionSettingFilterModel';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AddressSettingsRequests = {
    getFilterSettings(filter: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getFilterSettings.name, '/Settings/Filter', filter, resolver, resolveError);
    },
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getSettings.name, '/Settings/Address', null, resolver, resolveError);
    },
    postSaveFilterSettings(saveSettings: IInstitutionSettingFilterModel,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveFilterSettings.name, '/Settings/Filter/Save', saveSettings, resolver, resolveError);
    },
    postSaveSettings(saveSettingsGlobal: IAddressSettingsGlobal,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/Address/Save', saveSettingsGlobal, resolver, resolveError);
    }
};

// Export object with the requests
export default AddressSettingsRequests;