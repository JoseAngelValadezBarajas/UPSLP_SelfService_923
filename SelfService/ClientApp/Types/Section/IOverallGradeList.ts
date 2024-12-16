/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IOverallGradeList.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { IOverallGradeListTerm } from './IOverallGradeListTerm';

export interface IOverallGradeList extends IAvatar {
    checkbox: boolean;
    creditType: string;
    creditTypeValues: IDropDownOption[];
    email: string;
    finalterm: IOverallGradeListTerm;
    hasEmail: boolean;
    midterm: IOverallGradeListTerm;
    peopleId: string;
    projectedGrade: string;
    studentId: number;
    withdrawn: boolean;
}