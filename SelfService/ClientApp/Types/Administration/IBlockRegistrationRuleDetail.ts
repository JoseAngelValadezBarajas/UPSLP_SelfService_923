/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IBlockRegistrationRuleDetail.ts */

import { IBlockRegistrationRuleGroup } from './IBlockRegistrationRuleGroup';
import { IBlockRegistrationRuleHeader } from './IBlockRegistrationRuleHeader';

export interface IBlockRegistrationRuleDetail extends IBlockRegistrationRuleHeader {
    blockRegRuleGroups: IBlockRegistrationRuleGroup[];
    isBlockRegistrationOnly: boolean;
    termPeriodId: number;
    viewName: string;
}