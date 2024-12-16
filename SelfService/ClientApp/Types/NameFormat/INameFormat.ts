/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: INameFormat.ts */

// Types
import { INameFormatItem } from './INameFormatItem';

export interface INameFormat {
    overallCount: number;
    nameFormatList: INameFormatItem[];
}