/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ISectionFee.ts */

import { ICourseFee } from '../Course/ICourseFee';

export interface ISectionFee extends ICourseFee {
    feeGroupId: string;
    feeGroupDescription: string;
}