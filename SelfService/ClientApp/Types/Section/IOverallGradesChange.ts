/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IOverallGradesChange.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface IOverallGradesChange {
    gradeChangeReasons: IDropDownOption[];
    isFinalGradeChangeReasonRequired: boolean;
    isMidtermGradeChangeReasonRequired: boolean;
}