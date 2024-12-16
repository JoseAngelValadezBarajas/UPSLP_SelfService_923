/* Copyright 2018 - 2020 Ellucian Company L.P. and its affiliates.
 * File: IAdvisee.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';

export interface IAdvisee extends IAvatar {
    checkbox: boolean;
    email: string;
    hasStopList: boolean;
}