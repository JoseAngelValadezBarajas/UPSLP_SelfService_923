/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: EmailModal.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Types
import { IEmail } from '../../Types/Generic/IEmail';

// Functions for requests
const EmailModalRequests = {
    getCurrentAccountEmail(resolver: (json: string) => void): void {
        Request.post(this.getCurrentAccountEmail.name, '/People/CurrentAccountEmail', null, resolver);
    },
    getEmailRegExp(resolver: (json: string) => void): void {
        Request.post(this.getEmailRegExp.name, '/Settings/EmailRegExp', null, resolver);
    },
    sendEmail(genericEmail: IEmail, resolver: (json: string) => void): void {
        Request.post(this.sendEmail.name, '/GenericEmail/Send', genericEmail, resolver);
    }
};

// Export object with the requests
export default EmailModalRequests;