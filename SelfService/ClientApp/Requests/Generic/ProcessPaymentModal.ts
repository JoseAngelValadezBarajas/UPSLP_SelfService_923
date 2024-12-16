/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ProcessPaymentModal.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IGiftCampaign } from '../../Types/MakeGift/IGiftCampaign';
import { IRequestTranscript } from '../../Types/Grades/IRequestTranscript';
import { IPaymentRequest } from '../../Types/Payment/IPaymentRequest';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const ProcessPaymentModalRequests = {
    postProcessPayment(paymentRequest: IPaymentRequest,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postProcessPayment.name, '/Payment/Process', { paymentRequest }, resolver, resolveError);
    },
    postProcessTranscriptPayment(paymentRequest: IPaymentRequest,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void,
        requestTranscripts?: IRequestTranscript[]): void {
        Request.post(this.postProcessTranscriptPayment.name, '/Payment/Process', { paymentRequest, requestTranscripts }, resolver, resolveError);
    },
    postProcessDonationPayment(paymentRequest: IPaymentRequest,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void,
        giftCampaigns?: IGiftCampaign[]): void {
        Request.post(this.postProcessTranscriptPayment.name, '/Payment/Process', { paymentRequest, giftCampaigns }, resolver, resolveError);
    }
};

// Export object with the requests
export default ProcessPaymentModalRequests;