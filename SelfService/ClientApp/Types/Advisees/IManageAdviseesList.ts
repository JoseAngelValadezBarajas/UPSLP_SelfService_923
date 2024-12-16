/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: IManageAdviseesList.ts */

import { IManageAdvisee } from './IManageAdvisee';

export interface IManageAdviseesList {
    advisees: IManageAdvisee[];
    overallCount: number;
    showAttendanceWarning: boolean;
    showGradesWarning: boolean;
    showViolationWarning: boolean;
}