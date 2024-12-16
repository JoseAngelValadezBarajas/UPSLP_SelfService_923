/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Campaigns.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IInstitutionSettingFilterModel } from '../../Types/InstitutionSettings/IInstitutionSettingFilterModel';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const CampaignsRequests = {
    getCampaigns(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getCampaigns.name, '/Donations', {}, resolver, resolveError);
    },
    saveFilterSettings(institutionSettingFilterModel: IInstitutionSettingFilterModel,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.saveFilterSettings.name, '/Settings/Filter/Save', institutionSettingFilterModel, resolver, resolveError);
    }
};

// Export object with the requests
export default CampaignsRequests;