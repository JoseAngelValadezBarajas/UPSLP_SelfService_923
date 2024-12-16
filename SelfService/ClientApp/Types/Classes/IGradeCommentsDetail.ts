/* Copyright 2022 Ellucian Company L.P. and its affiliates.
 * File: IGradeCommentsDetail.ts */

// Types
import { GradeType } from "../Enum/GradeType";

export interface IGradeCommentsDetail {
    instructorComments: string;
    transcriptComments: string;
    enteredDate?: string;
    enteredFullName?: string;
    enteredTime?: string;
    grade?: string;
    gradeType: GradeType;
    isPending: boolean;
    isPosted: boolean;
    modifiedDate?: string;
    modifiedFullName?: string;
    modifiedTime?: string;
    studentGradeId: number;
    submissionDate?: string;
    submissionFullName?: string;
    submissionTime?: string;

    // UI
    instructorCommentsBackup?: string;
}

