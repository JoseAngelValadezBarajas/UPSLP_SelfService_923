/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPayment.ts */

export interface IPayment {
    application: string;
    balance: string;
    conEdRegistration: string;
    donations: string;
    registration: string;
    transcriptRequest: string;
    // UI validations
    balanceIsValid: boolean;
    conEdRegistrationIsValid: boolean;
    registrationIsValid: boolean;
    transcriptRequestIsValid: boolean;
}