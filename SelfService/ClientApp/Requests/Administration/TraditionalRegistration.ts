/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: TraditionalRegistration.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { PaymentOrigin } from '../../Types/Enum/PaymentOrigin';
import { ITraditionalRegistration } from '../../Types/InstitutionSettings/ITraditionalRegistration';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const TraditionalRegistrationRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSettings.name, '/Settings/Registration', resolver, resolveError);
    },
    postSaveSettings(registration: ITraditionalRegistration, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/Registration', registration, resolver, resolveError);
    },
    postValidateRegistrationPayment(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateRegistrationPayment.name,
            '/Settings/Payment/Validate',
            {
                fromPayment: false,
                paymentOrigin: PaymentOrigin.Registration
            },
            resolver,
            resolveError);
    }
};

// Export object with the requests
export default TraditionalRegistrationRequests;