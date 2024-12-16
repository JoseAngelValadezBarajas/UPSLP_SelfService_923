/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IBlockRegistrationRule.ts */

import { IBlockRegistrationRuleGroup } from './IBlockRegistrationRuleGroup';
import { IBlockRegistrationRuleHeader } from './IBlockRegistrationRuleHeader';

export interface IBlockRegistrationRule extends IBlockRegistrationRuleHeader {
    blockRegRuleGroups: IBlockRegistrationRuleGroup[];
    blockRegRuleGroupsToRemove: number[];
    isBlockRegistrationOnly: boolean;
    termPeriodId: number;
    viewName: string;
    // UI
    isPriorityDuplicated?: boolean;
    isPriorityError?: boolean;
    isRuleNameDuplicated?: boolean;
    isRuleNameError?: boolean;
    isViewNameError?: boolean;
}

export interface IBlockRegistrationRuleSearch {
    length: number;
    name: string;
    startIndex: number;
    termPeriodId: number;
}