/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IOverallGradesSaveChange.ts */

export interface IOverallGradesSaveChange {
    grade: string;
    isSubmit?: boolean;
    narrativeGrade?: string;
    reasonId?: number;
    studentGradeId?: number;
}