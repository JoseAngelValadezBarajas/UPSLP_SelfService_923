/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IMakeGift.ts */

import { IDropDownOption } from "@hedtech/powercampus-design-system/types/IDropDownOption";

export interface IMakeGift {
    campaigns: IDropDownOption[];
    defaultCampaign: number;
    hasEmailType: boolean;
    hasPaymentUrl: boolean;
    hasGiftBatch: boolean;
    isAuthenticated: boolean;
}