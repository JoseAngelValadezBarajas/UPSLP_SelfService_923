/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: ISectionAssignmentErrors.ts */

export interface ISectionAssignmentErrors {
    assignmentTypeDesc: string;
    assignmentTypeId: number;
    finalDropsWithUnequalWeights: boolean;
    hasTooManyFinalDrops: boolean;
    hasTooManyMidtermDrops: boolean;
    midtermDropsWithUnequalWeights: boolean;
}