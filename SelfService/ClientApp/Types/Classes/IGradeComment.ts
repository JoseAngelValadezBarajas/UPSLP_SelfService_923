/* Copyright 2022 Ellucian Company L.P. and its affiliates.
 * File: IGradeComment.ts */

// Types
import { GradeType } from "../Enum/GradeType";

export interface IGradeComment {
    comments: string;
    gradeType: GradeType;
    studentGradeId: number;
    sectionId: number;
    studentId: number;
}