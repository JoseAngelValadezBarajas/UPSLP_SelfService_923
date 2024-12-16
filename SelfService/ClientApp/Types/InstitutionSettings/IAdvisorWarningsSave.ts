/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAdvisorWarningsSave.ts */

export interface IAdvisorWarningsSave {
    excusedAbsences?: number;
    excusedTardiness?: number;
    selectedGrades: number[];
    selectedViolations: number[];
    showAttendance: boolean;
    showGrades: boolean;
    showViolations: boolean;
    unexcusedAbsences?: number;
    unexcusedTardiness?: number;
}