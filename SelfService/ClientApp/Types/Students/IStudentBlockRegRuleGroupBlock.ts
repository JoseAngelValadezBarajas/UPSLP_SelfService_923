/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IStudentBlockRegRuleGroupBlock.ts */

import { IYearTerm } from '../Generic/IYearTerm';

export interface IStudentBlockRegRuleGroupBlock {
    blockRegRuleGroupBlockId: number;
    cartSections?: number[];
    dropSections?: number[];
    waitlistSections?: number[];
    yearTerm?: IYearTerm;
}