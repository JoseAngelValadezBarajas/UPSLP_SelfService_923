/* Copyright 2020-2023 Ellucian Company L.P. and its affiliates.
 * File: MakeGift.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPersonalInformation } from '../../Types/Account/IPersonalInformation';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const MakeGiftRequests = {
    getEmailRegExp(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getEmailRegExp.name, '/Settings/EmailRegExp', null, resolver, resolveError);
    },
    getOptions(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getOptions.name, '/Donations/Gift', null, resolver, resolveError);
    },
    getPersonalInfoOptions(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getPersonalInfoOptions.name, '/Donations/PersonalInfo/Options', null, resolver, resolveError);
    },
    getReCaptchaSettings(resolver: (json: string) => void): void {
        Request.post(this.getReCaptchaSettings.name, '/Donations/RecaptchaSettings', null, resolver);
    },
    postPersonalInfo(personalInfo: IPersonalInformation, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postPersonalInfo.name, '/Donations/PersonalInfo',
            personalInfo, resolver, resolveError);
    },
    postCancelPayment(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postPersonalInfo.name, '/Donations/PersonalInfo/Cancel',
            null, resolver, resolveError);
    },
};

// Export object with the requests
export default MakeGiftRequests;