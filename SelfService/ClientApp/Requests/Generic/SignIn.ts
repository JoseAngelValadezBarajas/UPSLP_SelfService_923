/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: SignIn.ts */

// Types
import { IPasswordChange } from '../../Types/Account/IPasswordChange';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const SignInRequests = {
    authenticateUser(userName: string, password: string, resolver: (json: string) => void): void {
        Request.post(this.authenticateUser.name, '/SignIn/Authenticate', { userName, password }, resolver);
    },
    changePassword(passwordChange: IPasswordChange, resolver: (json: string) => void): void {
        Request.post(this.changePassword.name, '/Password/ChangePassword', passwordChange, resolver);
    },
    getAuthenticationMode(userName: string, resolver: (json: string) => void): void {
        Request.post(this.getAuthenticationMode.name, '/SignIn/GetAuthenticationMode', userName, resolver);
    },
    isForgotPasswordEnabled(resolver: (json: string) => void): void {
        Request.post(this.isForgotPasswordEnabled.name, '/SignIn/IsForgotPasswordEnabled', null, resolver);
    },
    sendForgotPasswordEmail(userName: string, reCaptchaResponse: string, resolver: (json: string) => void): void {
        Request.post(this.sendForgotPasswordEmail.name, '/SignIn/SendForgotPasswordEmail', { userName, reCaptchaResponse }, resolver);
    },
};

// Export object with the requests
export default SignInRequests;