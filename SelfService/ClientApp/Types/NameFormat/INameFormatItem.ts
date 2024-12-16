/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: INameFormatItem.ts */

export interface INameFormatItem {
    id: number;
    name: string;
    isActive: boolean;
    isAssignedToCategory: boolean;
    isActiveChanged: boolean;

    // UI
    isLoading?: boolean;
}