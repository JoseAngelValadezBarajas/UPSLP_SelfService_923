/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPaymentDiscountCoupon.ts */

export interface IPaymentDiscountCoupon {
    code: string;
    isValid: boolean;
    // UI
    isApplied: boolean;
    isModified: boolean;
    isNew: boolean;
}