/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPaymentInfo.ts */

import { IDiscountChargeCredit } from '../Balance/IDiscountChargeCredit';

export interface IPaymentInfo {
    applicationId?: number;
    chargeCredits: IDiscountChargeCredit[];
    conEdTransactionId?: number;
    currentBalance: string;
    currentBalanceValue: number;
    paymentDue: string;
    paymentDueValue: number;
    requireOnlinePayment: boolean;
    statementNumber: number;
    totalAmount: string;
    totalAmountValue: number;
    useTransactionChargesOnly: boolean;
    // UI validations
    modified: boolean;
    anotherAmount: string;
    invalidAnotherAmount: boolean;
    canPay: boolean;
}