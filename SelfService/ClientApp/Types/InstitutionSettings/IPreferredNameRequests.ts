/* Copyright 2019 -2020 Ellucian Company L.P. and its affiliates.
 * File: IPreferredNameRequests.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';

export interface IPreferredNameRequests {
    avatar: IAvatar;
    dateOfRequest: string;
    hasPicture: boolean;
    peopleId: string;
}