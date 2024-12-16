/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: INamePartItem.ts */

export interface INamePartItem {
    displayOrder: number;
    sortOrder: number;
    namePart: string;
    separator: string;
    isChanged: boolean;
}