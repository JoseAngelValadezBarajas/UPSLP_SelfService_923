/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IStaffMember.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';

export interface IStaffMember extends IAvatar {
    officeId: number;
}
