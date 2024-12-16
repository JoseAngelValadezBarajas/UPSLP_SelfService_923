/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: EmailProvider.ts */

// Types
import { IEmailSettings } from '../../Types/InstitutionSettings/IEmailSettings';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const EmailProviderRequests = {
    getEmailRegExp(resolver: (json: string) => void): void {
        Request.post(this.getEmailRegExp.name, '/Settings/EmailRegExp', null, resolver);
    },
    getSettings(resolver: (json: string) => void): void {
        Request.post(this.getSettings.name, '/Settings/Email', null, resolver);
    },
    postSaveSettings(mail: IEmailSettings, resolver: (json: string) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/Email/Save', mail, resolver);
    }
};

// Export object with the requests
export default EmailProviderRequests;