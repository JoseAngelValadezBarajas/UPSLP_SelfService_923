/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IStudentSchedule.ts */

import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';

export interface IBlockStudentSchedule {
    allowChanges: boolean;
    blockRegistrationRuleGroupId: number;
    blockRegRuleGroupBlockId: number;
    displayName: string;
    numberOfSections: number;
    numberOfSectionsSelected: number;
    showDrop: boolean;
    studentSchedule: IStudentSchedule[][];
    // UI
    expanded: boolean;
    isLoading: boolean;
    status: BlockRegBlockStatus;
}

export enum BlockRegBlockStatus {
    None = 0,
    Processing = 1,
    Completed = 2,
    Unset = 3
}