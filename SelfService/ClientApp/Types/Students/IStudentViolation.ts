/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IStudentViolation.ts */

export interface IStudentViolation {
    createdBy: string;
    createdDate: string;
    alertName: string;
    description: string;
    isEditable: boolean;
    sectionId: number;
    studentId: number;
    violationDate: string;
    violationId: number;
    violationTypeId: number;
}