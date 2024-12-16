/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IActivityGrades.ts */

import { IActivityGradesProgress } from './IActivityGradesProgress';

export interface IActivityGrades {
    faculties: string | undefined;
    finalScore: string | undefined;
    midtermAssignments: IActivityGradesProgress[];
    finaltermAssignments: IActivityGradesProgress[];
    midtermScore: string | undefined;
    sectionName: string | undefined;
}