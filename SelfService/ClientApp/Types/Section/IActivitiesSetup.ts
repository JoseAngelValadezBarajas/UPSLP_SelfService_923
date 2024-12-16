/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IActivitiesSetup.ts */

import { IAssignmentTypes } from './IAssignmentTypes';

export interface IActivitiesSetup {
    allowDeleteAll: boolean;
    assignmentTypes: IAssignmentTypes[];
    finalMaxDrop: number;
    isWeightByType: boolean;
    midtermMaxDrop: number;
    sectionId: number;
    showMidterm: boolean;
    totalFinalPoints: string;
    totalMidtermPoints: string;
    weightMethod: number;
}