/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IMakeGiftDetails.ts */

export interface IMakeGiftDetails {
    campaignSelected: number;
    amount: string;
    isAmountRequired?: boolean;
    isAmountValid?: boolean;
    isCampaignsRequired?: boolean;
    isUniqueCampaign?: boolean;
    isValidCampaing: boolean;
    isValidAmount: boolean;
}