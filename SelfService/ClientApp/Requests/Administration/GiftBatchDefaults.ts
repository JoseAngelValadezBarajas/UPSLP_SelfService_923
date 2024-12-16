/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: GiftBatchDefaults.ts */

// Types
import { IDonationSettings } from '../../Types/InstitutionSettings/IDonationSettings';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const GiftBatchDefaultsRequests = {
    getOptions(resolver: (json: string) => void): void {
        Request.post(this.getOptions.name, '/Donations/Options', null, resolver);
    },
    getSettings(resolver: (json: string) => void): void {
        Request.get(this.getSettings.name, '/Settings/Donation', resolver);
    },
    saveSettings(donation: IDonationSettings, resolver: (json: string) => void): void {
        Request.post(this.saveSettings.name, '/Settings/Donation/Save', donation, resolver);
    }
};

// Export object with the requests
export default GiftBatchDefaultsRequests;