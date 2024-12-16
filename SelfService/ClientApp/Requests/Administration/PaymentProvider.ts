/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: PaymentProvider.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { PaymentOrigin } from '../../Types/Enum/PaymentOrigin';
import { IPayment } from '../../Types/InstitutionSettings/IPayment';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const PaymentProviderRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getSettings.name, '/Settings/Payment', null, resolver, resolveError);
    },
    postSaveSettings(settings: IPayment, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/Payment/Save', settings, resolver, resolveError);
    },
    postValidateBalancePayment(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateBalancePayment.name,
            '/Settings/Payment/Validate',
            {
                fromPayment: true,
                paymentOrigin: PaymentOrigin.MakePayment
            },
            resolver,
            resolveError);
    },
    postValidateRegistrationPayment(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateRegistrationPayment.name,
            '/Settings/Payment/Validate',
            {
                fromPayment: true,
                paymentOrigin: PaymentOrigin.Registration
            },
            resolver,
            resolveError);
    },
    postValidateTranscriptRequestPayment(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateTranscriptRequestPayment.name,
            '/Settings/Payment/Validate',
            {
                fromPayment: true,
                paymentOrigin: PaymentOrigin.TranscriptRequest
            },
            resolver,
            resolveError);
    },
    postValidateConEdRegistrationPayment(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateTranscriptRequestPayment.name,
            '/Settings/Payment/Validate',
            {
                fromPayment: true,
                paymentOrigin: PaymentOrigin.ConEdRegistration
            },
            resolver,
            resolveError);
    }
};

// Export object with the requests
export default PaymentProviderRequests;