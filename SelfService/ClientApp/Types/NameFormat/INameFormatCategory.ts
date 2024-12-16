/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: INameFormatCategory.ts */

export interface INameFormatCategory {
    categoryId: number;
    categoryCode: string;
    nameFormatId: number;
    nameFormatDesc: string;
    isCategoryChanged: boolean;

    // UI
    hasInformation?: boolean;
    information: string;
    openInfo: boolean;
}