/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ICourseTemplatesAssignments.ts */

export interface ICourseTemplatesAssignments {
    assignedDate: string;
    assignmentEndDate: string;
    assignmentId: number;
    assignmentTitle: string;
    assignmentTypeId: number;
    countsForFinal: boolean;
    countsForMidterm: boolean;
    description: string;
    disableGrading: boolean;
    dueDate: string;
    finalPercentage?: number;
    finalWeight?: number;
    midtermPercentage?: number;
    gradeDueDate: string;
    gradeEntryDate: string;
    hasGrade: boolean;
    isEarned: boolean;
    isExtraCredit: boolean;
    midtermWeight: number;
    possiblePoints: number;
    totalPoints: number;
}