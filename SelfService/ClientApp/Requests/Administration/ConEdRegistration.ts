/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ConEdRegistration.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { PaymentOrigin } from '../../Types/Enum/PaymentOrigin';
import { IConEdRegistration } from '../../Types/InstitutionSettings/IConEdRegistration';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const ConEdRegistrationRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSettings.name, '/Settings/ConEdRegistration', resolver, resolveError);
    },
    postSaveSettings(conEdRegistration: IConEdRegistration, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/ConEdRegistration', conEdRegistration, resolver, resolveError);
    },
    postValidateConEdRegistrationPayment(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateConEdRegistrationPayment.name,
            '/Settings/Payment/Validate',
            {
                fromPayment: false,
                paymentOrigin: PaymentOrigin.ConEdRegistration
            },
            resolver,
            resolveError);
    }
};

// Export object with the requests
export default ConEdRegistrationRequests;