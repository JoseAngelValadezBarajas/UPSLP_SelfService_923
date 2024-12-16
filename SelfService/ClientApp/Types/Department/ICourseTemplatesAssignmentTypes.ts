/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ICourseTemplatesAssignmentTypes.ts */

import { ICourseTemplatesAssignments } from './ICourseTemplatesAssignments';

export interface ICourseTemplatesAssignmentTypes {
    assignmentTypeDesc: string;
    assignmentTypeId: number;
    assignmentTypeRuleId: number;
    assignments: ICourseTemplatesAssignments[];
    endDate: string;
    finalDropHighest: number;
    finalDropLowest: number;
    finalMaxDrop: number;
    finalWeight: number;
    midtermDropHighest: number;
    midtermDropLowest: number;
    midtermMaxDrop: number;
    midtermWeight: number;
    totalFinalPoints: string;
    totalMidtermPoints: string;
}