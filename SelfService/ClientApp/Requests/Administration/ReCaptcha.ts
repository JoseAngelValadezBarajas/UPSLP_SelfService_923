/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: ReCaptcha.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Types
import { IReCaptchaSettings } from '../../Types/Administration/IReCaptchaSettings';

// Functions for requests
const ReCaptchaRequests = {
    getReCaptchaSettings(resolver: (json: string) => void): void {
        Request.post(this.getReCaptchaSettings.name, '/Settings/ReCaptcha', null, resolver);
    },
    saveReCaptchaSettings(reCaptcha: IReCaptchaSettings, resolver: (json: string) => void): void {
        Request.post(this.saveReCaptchaSettings.name, '/Settings/ReCaptcha/Save', reCaptcha, resolver);
    }
};

// Export object with the requests
export default ReCaptchaRequests;