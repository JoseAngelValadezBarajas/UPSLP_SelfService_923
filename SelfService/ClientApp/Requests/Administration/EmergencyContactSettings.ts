/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: EmergencyContactSettings.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IEmergencyContactSettings } from '../../Types/InstitutionSettings/IEmergencyContactSettings';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const EmergencyContactSettingsRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getSettings.name, '/Settings/EmergencyContacts', null, resolver, resolveError);
    },
    postSaveSettings(emergencyContacts: IEmergencyContactSettings,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/EmergencyContacts/Save',
            emergencyContacts, resolver, resolveError);
    }
};

// Export object with the requests
export default EmergencyContactSettingsRequests;