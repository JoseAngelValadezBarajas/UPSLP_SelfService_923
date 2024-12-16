/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPaymentRequest.ts */

// Types
import { PaymentOrigin } from '../Enum/PaymentOrigin';
import { IYearTerm } from '../Generic/IYearTerm';
import { IPaymentPeriod } from './IPaymentPeriod';

export interface IPaymentRequest {
    amount: number;
    applicationId?: number;
    conEdTransactionId?: number;
    paymentOrigin: PaymentOrigin;
    paymentPeriod?: IPaymentPeriod;
    personId?: number;
    returnUrl?: string;
    yearTerm?: IYearTerm;
}