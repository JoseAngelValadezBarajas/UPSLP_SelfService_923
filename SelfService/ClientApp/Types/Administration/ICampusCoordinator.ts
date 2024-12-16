/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: ICampusCoordinator.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';

export interface ICampusCoordinator extends IAvatar {
    campusCoordinatorId: number;
    campusName: string;
    organizationId: number;
    // UI
    isDuplicated: boolean;
    isEditable: boolean;
    isModified: boolean;
    originalOrganizationId: number;
}

export interface ICampusCoordinatorSave {
    campusCoordinatorId: number;
    organizationId: number;
    personId: number;
}