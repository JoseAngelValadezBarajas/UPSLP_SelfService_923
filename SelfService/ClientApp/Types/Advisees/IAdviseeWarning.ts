/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IAdviseeWarning.ts */

export interface IAdviseeWarning {
    personId: number;
    hasAttendanceWarning: boolean;
    hasGradesWarning: boolean;
    hasViolationWarning: boolean;
}