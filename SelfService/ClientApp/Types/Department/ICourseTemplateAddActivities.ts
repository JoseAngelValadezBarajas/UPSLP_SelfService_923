/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IAssignments.ts */

export interface ICourseTemplateAddActivities {
    assignedDate?: string;
    assignmentEndDate?: string;
    assignmentId?: number;
    assignmentTitle?: string;
    assignmentTypeId?: number;
    countsForFinal?: boolean;
    countsForMidterm?: boolean;
    description?: string;
    dueDate?: string;
    finalWeight?: number;
    gradeDueDate?: string;
    gradeEntryDate?: string;
    isAssignedDateChanged?: boolean;
    isdueDateChanged?: boolean;
    isExtraCredit?: boolean;
    midtermWeight?: number;
    possiblePoints?: number;
    totalPoints?: number;
}