/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IBalancePayment.ts */

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface IBalancePayment {
    amount: string;
    enableOnlinePayment: boolean;
    periods: IDropDownOption[];
    periodSelected?: IDropDownOption;
    invalidAmount: boolean;
    modifiedAmount: boolean;
    modifiedPeriod: boolean;
}