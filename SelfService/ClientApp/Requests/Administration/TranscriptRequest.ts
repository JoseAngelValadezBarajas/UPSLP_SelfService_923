/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: TranscriptRequest.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { PaymentOrigin } from '../../Types/Enum/PaymentOrigin';
import { ITranscriptRequest } from '../../Types/InstitutionSettings/ITranscripRequest';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const TranscripRequestRequests = {
    getTranscriptSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getTranscriptSettings.name, '/Settings/TranscriptRequest', null, resolver, resolveError);
    },
    saveTranscriptSettings(transcriptRequest: ITranscriptRequest, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.saveTranscriptSettings.name, '/Settings/TranscriptRequest/Save', transcriptRequest, resolver, resolveError);
    },
    validatePayment(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.validatePayment.name,
            '/Settings/Payment/Validate',
            {
                fromPayment: false,
                paymentOrigin: PaymentOrigin.TranscriptRequest
            },
            resolver,
            resolveError);
    }
};

// Export object with the requests
export default TranscripRequestRequests;