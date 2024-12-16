/* Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 * File: ISectionViolation.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { IViolation } from './IViolation';
import { IViolationCategories } from './IViolationCategories';

export interface ISectionViolation extends IAvatar {
    checkbox: boolean;
    email: string;
    displayName: string;
    peopleId: string;
    violationCategoryList: IViolationCategories[];
    violationList: IViolation[];
    withdrawn: boolean;
}