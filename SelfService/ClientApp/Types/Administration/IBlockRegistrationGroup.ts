/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IBlockRegistrationGroup.ts */

import { IBlockRegistrationGroupHeader } from './IBlockRegistrationGroupHeader';

export interface IBlockRegistrationGroup extends IBlockRegistrationGroupHeader {
    allowChanges?: boolean;
    description: string;
    displayName: string;
    isEditable: boolean;
    sectionsToAdd: number[];
    sectionsToRemove: number[];
    termPeriodId: number;
    // UI
    isGroupNameError?: boolean;
    isGroupNameDuplicated?: boolean;
    isDisplayNameError?: boolean;
}

export interface IBlockRegistrationGroupSearch {
    filter: number;
    length: number;
    name: string;
    startIndex: number;
    termPeriodId: number;
}