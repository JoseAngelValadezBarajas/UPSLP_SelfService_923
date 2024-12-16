/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IBlockRegistrationRuleGroup.ts */

import { IBlockRegistrationGroupHeader } from './IBlockRegistrationGroupHeader';

export interface IBlockRegistrationRuleGroup {
    blockDetails: IBlockRegRuleGroupBlock[];
    blockRegistrationRuleGroupId: number;
    blockRegRuleGroupBlocksToAdd: number[];
    blockRegRuleGroupBlocksToRemove: number[];
    displayName: string;
    isEditable: boolean;
    name: string;
    numberOfBlocks: number;
    order: number;
    // UI
    status?: BlockRegRuleGroupStatus;
    expanded?: boolean;
    expandedDetails?: boolean;
    isDisplayNameError?: boolean;
    isLoadingDetail?: boolean;
    isNameDuplicated?: boolean;
    isNameError?: boolean;
}

export interface IBlockRegRuleGroupBlock extends IBlockRegistrationGroupHeader {
    blockRegRuleGroupBlockId: number;
}

export enum BlockRegRuleGroupStatus {
    None = 0,
    Processing = 1,
    Completed = 2,
    Unset = 4
}