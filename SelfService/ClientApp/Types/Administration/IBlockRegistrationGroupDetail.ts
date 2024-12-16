/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IBlockRegistrationGroupDetail.ts */

import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { BlockRegBlockStatus } from '../Students/IStudentSchedule';
import { IBlockRegistrationGroup } from './IBlockRegistrationGroup';

export interface IBlockRegistrationGroupDetail {
    blockRegistrationGroup: IBlockRegistrationGroup;
    sectionList: ISection[];
}

export interface IBlockRegistrationGroupSearch {
    filter: number;
    length: number;
    name: string;
    startIndex: number;
    termPeriodId: number;
}

export interface IBlockRegRuleGroup extends IBlockRegistrationGroupDetail {
    blockRegRuleGroupBlockId: number;
    totalCredits: string;
    // UI
    status: BlockRegBlockStatus;
}