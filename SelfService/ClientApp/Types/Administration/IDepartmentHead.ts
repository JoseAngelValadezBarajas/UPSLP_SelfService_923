/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: IDepartmentHead.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';

export interface IDepartmentHead extends IAvatar {
    departmentDesc: string;
    departmentHeadId: number;
    departmentId: number;
    // UI
    originalDepartmentId: number;
    isEditable: boolean;
    isDuplicated: boolean;
    isModified: boolean;
}

export interface IDepartmentHeadSave {
    departmentHeadId: number;
    departmentId: number;
    personId: number;
}