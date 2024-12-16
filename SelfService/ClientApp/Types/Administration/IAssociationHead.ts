/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IAssociationHead.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';

export interface IAssociationHead extends IAvatar {
    associationHeadId: number;
    associationDesc: string;
    associationId: number;
    // UI
    originalAssociationId: number;
    isEditable: boolean;
    isDuplicated: boolean;
    isModified: boolean;
}

export interface IAssociationHeadSave {
    associationHeadId: number;
    associationId: number;
    personId: number;
    // UI
    fullName?: string;
    isDuplicated?: boolean;
    isModified?: boolean;
    peopleId?: string;
}