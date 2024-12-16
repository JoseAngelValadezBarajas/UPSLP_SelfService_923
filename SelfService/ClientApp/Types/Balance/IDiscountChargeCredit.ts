/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IDiscountChargeCredit.ts */

import { IBaseChargeCredit } from './IBaseChargeCredit';

export interface IDiscountChargeCredit extends IBaseChargeCredit {
    discountAmount: string;
    discountAmountValue: number;
    discountCode: string;
    eventId: string;
    eventName: string;
    isOther: boolean;
    sectionId: number;
}