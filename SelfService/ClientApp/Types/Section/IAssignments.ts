/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IAssignments.ts */

export interface IAssignments {
    allowDelete?: boolean;
    assignedDate?: string;
    assignmentEndDate?: string;
    assignmentId?: number;
    title?: string;
    assignmentType?: string;
    assignmentTypeId?: number;
    assignmentTypeRuleId?: number;
    countsForFinal?: boolean;
    countsForMidterm?: boolean;
    description?: string;
    dueDate?: string;
    finalPercentage?: number;
    finalWeight?: number;
    id?: number;
    isAssignedDateChanged?: boolean;
    isdueDateChanged?: boolean;
    isExtraCredit?: boolean;
    midtermPercentage?: number;
    midtermWeight?: number;
    possiblePoints?: number;
    sectionId?: number;
    type?: number;

    // UI
    isOpenInfo?: boolean;
}