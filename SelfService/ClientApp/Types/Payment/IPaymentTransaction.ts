/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPaymentTransaction.ts */

export interface IPaymentTransaction {
    amount: string;
    authorizationNumber: string;
    description: string;
    returnUrl: string;
    status: number;
    transactionId: number;
}