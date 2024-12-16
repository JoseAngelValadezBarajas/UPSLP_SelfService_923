/* Copyright 2020-2022 Ellucian Company L.P. and its affiliates.
 * File: IWhatIfPlan.ts */

import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

export interface IWhatIfPlan {
    curriculum: string;
    degree: string;
    impersonateInfo?: IImpersonateInfo;
    program: string;
    termPeriodId: number;
}