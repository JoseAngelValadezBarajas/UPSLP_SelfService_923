/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ICourseCatalog.ts */

import { ISubType } from './ISubType';

export interface ICourseCatalog {
    code: string;
    name: string;
    description: string;
    subTypeList: ISubType | ISubType[];
    subtypes: string;
}