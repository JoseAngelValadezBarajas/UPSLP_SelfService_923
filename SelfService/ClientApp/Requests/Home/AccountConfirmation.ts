/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: AccountConfirmation.ts */

// Types
import { IIdentityAccount } from '../../Types/Account/IIdentityAccount';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AccountConfirmationRequests = {
    signUpSharedAccess(account: IIdentityAccount,
        resolver: (json: string) => void): void {
        Request.post(this.signUpSharedAccess.name, '/SignUp/SharedAccess', account, resolver);
    }
};

// Export object with the requests
export default AccountConfirmationRequests;