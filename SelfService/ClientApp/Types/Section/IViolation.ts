/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IViolation.ts */

export interface IViolation {
    createdDate: string;
    description: string;
    isEditable: boolean;
    reportedByFullName: string;
    violationCategoryId: number;
    violationDate: string;
    violationDateTable: string;
    violationId: number;
    violationType: string;
    violationTypeId: number;
}