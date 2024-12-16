/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: ITranscriptRequest.ts */

export interface ITranscriptRequest {
    cashReceiptCode: number;
    cashReceiptOffice: number;
    chargeCreditCode: number;
    disclosureStatement: string;
    enableOnlinePayment: boolean;
    feeAmount?: string | number;
    requireConsent: boolean;
    requireOnlinePayment: boolean;
    // UI Validations
    cashReceiptCodeModified: boolean;
    cashReceiptOfficeModified: boolean;
    chargeCreditCodeModified: boolean;
    enableOnlinePaymentIsValid: boolean;
    enableProcessingFee: boolean;
    feeAmountModified: boolean;
    invalidAmount: boolean;
}