/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: RecoverPasswordRequests.ts */

// Types
import { IPasswordChange } from '../../Types/Account/IPasswordChange';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const RecoverPasswordRequests = {
    recoverPassword(passwordChange: IPasswordChange, resolver: (json: string) => void): void {
        Request.post(this.recoverPassword.name, '/Password/Recover', passwordChange, resolver);
    }
};

// Export object with the requests
export default RecoverPasswordRequests;