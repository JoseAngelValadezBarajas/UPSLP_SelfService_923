/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
* File: AccountMain.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPasswordChange } from '../../Types/Account/IPasswordChange';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AccountMainRequests = {
    getAccountInformation(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getAccountInformation.name, '/People/ProfileAccount', resolver, resolveError);
    },
    changePassword(
        currentPassword: string,
        newPassword: string,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.changePassword.name, '/Password/Change', { currentPassword, newPassword } as IPasswordChange, resolver, resolveError);
    },
    passwordPolicy(appArea: string,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.passwordPolicy.name, '/Password/Policy', { appArea }, resolver, resolveError);
    }
};

// Export object with the requests
export default AccountMainRequests;