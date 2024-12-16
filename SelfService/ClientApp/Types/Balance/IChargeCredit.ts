/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: IChargeCredit.ts */

import { IBaseChargeCredit } from './IBaseChargeCredit';

export interface IChargeCredit extends IBaseChargeCredit {
    dueDate: string;
    entryDate: string;
    estimatedLateFeeAmount: string;
    period: string;
    type: string;
}