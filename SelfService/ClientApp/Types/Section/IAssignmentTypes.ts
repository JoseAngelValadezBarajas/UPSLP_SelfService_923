/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IAssignmentTypes.ts */

import { IAssignments } from './IAssignments';

export interface IAssignmentTypes {
    assignments?: IAssignments[];
    assignmentsCount: number;
    assignmentTypeRuleId?: number;
    description: string;
    endDate: string;
    finalDropHighest: number;
    finalDropLowest: number;
    finalMaxDrop: number;
    finalWeight: number;
    id: number;
    isExpanded: boolean;
    isFinalDrop: boolean;
    isMidtermDrop: boolean;
    midtermDropHighest: number;
    midtermDropLowest: number;
    midtermMaxDrop: number;
    midtermWeight: number;
    sectionAssignments: IAssignments[];
    totalPoints: number;
}