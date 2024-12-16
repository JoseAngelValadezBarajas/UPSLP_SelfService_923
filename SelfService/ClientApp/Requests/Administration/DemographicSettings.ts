/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: DemographicSettings.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IDemographicSettings } from '../../Types/InstitutionSettings/IDemographicSettings';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const DemographicSettingsRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSettings.name, '/Settings/Demographic', resolver, resolveError);
    },
    postSaveSettings(demographic: IDemographicSettings, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/Demographic', demographic, resolver, resolveError);
    }
};

// Export object with the requests
export default DemographicSettingsRequests;