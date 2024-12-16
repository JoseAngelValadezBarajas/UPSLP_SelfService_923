/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Form.ts */

// Types
import { IFormSettings } from '../../Types/InstitutionSettings/IFormSettings';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const FormsRequests = {
    getOptions(resolver: (json: string) => void): void {
        Request.post(this.getOptions.name, '/Donations/Form/Options', null, resolver);
    },
    getSettings(resolver: (json: string) => void): void {
        Request.get(this.getSettings.name, '/Settings/Form', resolver);
    },
    saveSettings(form: IFormSettings, resolver: (json: string) => void): void {
        Request.post(this.saveSettings.name, '/Settings/Form/Save', form, resolver);
    }
};

// Export object with the requests
export default FormsRequests;