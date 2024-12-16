/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: PreferredNameSettings.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPreferredNameSettings } from '../../Types/InstitutionSettings/IPreferredNameSettings';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const PreferredNameSettingsRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getSettings.name, '/Settings/PreferredName', null, resolver, resolveError);
    },
    postSaveSettings(preferredName: IPreferredNameSettings, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/PreferredName/Save', preferredName, resolver, resolveError);
    }
};

// Export object with the requests
export default PreferredNameSettingsRequests;