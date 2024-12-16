/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ISubType.ts */

import { ICorequisite } from './ICorequisite';
import { ICourseFee } from './ICourseFee';
import { ICreditType } from './ICreditType';
import { IPrerequisite } from './IPrerequisite';

export interface ISubType {
    courseCatalogCode: string;
    code: string;
    name: string;
    description: string;
    credits: string;
    sortOrder: number;
    prerequisiteCondition: string;
    corequisiteCondition: string;
    creditTypeCondition: string;
    courseFeeCondition: string;
    prerequisiteList: IPrerequisite[];
    corequisiteList: ICorequisite[];
    creditTypeList: ICreditType[];
    courseFeeList: ICourseFee[];
}