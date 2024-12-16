/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: ISectionGradeMapping.ts */

export interface ISectionGradeMapping {
    creditTypeId: number;
    errorFinalPercentage: boolean;
    errorMidtermPercentage: boolean;
    gradeValue: string;
    gradeValueId: number;
    incorrectMinimumFinalPercentage: boolean;
    incorrectMinimumFinalPoints: boolean;
    incorrectMinimumMidtermPercentage: boolean;
    incorrectMinimumMidtermPoints: boolean;
    invalidMinimumFinalPercentage: boolean;
    invalidMinimumFinalPoints: boolean;
    invalidMinimumMidtermPercentage: boolean;
    invalidMinimumMidtermPoints: boolean;
    mappingId: number;
    minimumFinalPercentage: string | number | null;
    minimumFinalPoints: string | null;
    minimumMidtermPercentage: string | number | null;
    minimumMidtermPercentageCurrent: string | number | null;
    minimumMidtermPoints: string | null;
    modified: boolean;
    rank: number;
}