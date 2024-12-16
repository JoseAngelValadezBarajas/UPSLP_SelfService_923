
/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: INameFormatList.ts */

// Types
import { INamePartItem } from './INamePartItem';

export interface INameFormatList {
    id: number;
    name: string;
    isActive: boolean;
    isAssignedToCategory: boolean;
    namePartList?: INamePartItem[];
    preview: string;
    showMiddleNameInitial: boolean;
    sortPreview: string;
}