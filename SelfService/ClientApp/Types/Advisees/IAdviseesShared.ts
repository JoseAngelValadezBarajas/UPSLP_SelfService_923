/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IAdviseesShared.ts */

import { IAvatar } from "@hedtech/powercampus-design-system/types/IAvatar";

export interface IAdviseesShared {
    advisees: IAdviseeShared[];
    overallCount: number;
}

export interface IAdviseeShared extends IAvatar {
    email: string;
    // UI
    advisors?: IAdvisor[];
    checked?: boolean;
}

export interface IAdvisor extends IAvatar {
    sharedAdviseeId: number;
}
