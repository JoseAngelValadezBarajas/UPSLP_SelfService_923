/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ISectionDepartmentHead.ts */

import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';

export interface ISectionDepartmentHead {
    departmentDesc: string;
    sectionsApproval: ISectionApproval[];
}

export interface ISectionApproval extends ISection {
    requireApproval: boolean;
    // UI
    isLoading: boolean;
}