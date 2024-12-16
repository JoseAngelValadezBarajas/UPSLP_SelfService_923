/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IActivityGradesMidterm.ts */

import { IActivityGradesProgressDetail } from './IActivityGradesProgressDetail';

export interface IActivityGradesProgress {
    studentAssignments: IActivityGradesProgressDetail[];
    description: string | undefined;
}