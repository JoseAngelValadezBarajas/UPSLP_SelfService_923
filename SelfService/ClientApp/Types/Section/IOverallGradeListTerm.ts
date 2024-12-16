/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IOverallGradeListTerm.ts */

export interface IOverallGradeListTerm {
    approvedComments: string;
    approvedGrade: string;
    calculatedGrade: string;
    calculatedScore: string;
    gradeApprovalId: number;
    instructorComments: string;
    instructorGrade: string;
    isAllowedToChange: boolean;
    isApproved: boolean;
    isModified: boolean;
    isPending: boolean;
    isPosted: boolean;
    studentGradeId: number;
    transcriptComments: string;
    transcriptDetailId: number;
    transcriptGrade: string;
    // UI
    approvedGradeModified: string;
    changedApplied?: boolean;
    hasComments?: boolean;
}