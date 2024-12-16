/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: SignUp.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IIdentityAccount } from '../../Types/Account/IIdentityAccount';
import { IValidatePassword } from '../../Types/Generic/IPasswordPolicy';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const SignUpRequests = {
    getEmailRegExp(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getEmailRegExp.name, '/Settings/EmailRegExp', null, resolver, resolveError);
    },
    getPasswordPolicy(appArea: string,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getPasswordPolicy.name, '/Password/Policy', appArea, resolver, resolveError);
    },
    getReCaptchaSettings(resolver: (json: string) => void): void {
        Request.post(this.getReCaptchaSettings.name, '/SignUp/RecaptchaSettings', null, resolver);
    },
    postSignUpApplication(account: IIdentityAccount,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSignUpApplication.name, '/SignUp/Application', account, resolver, resolveError);
    },
    postSignUpConed(account: IIdentityAccount,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSignUpConed.name, '/SignUp/ConEd', account, resolver, resolveError);
    },
    postValidatePassword(passwordModel: IValidatePassword,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidatePassword.name, '/Password/Validate', passwordModel, resolver, resolveError);
    },
};

// Export object with the requests
export default SignUpRequests;