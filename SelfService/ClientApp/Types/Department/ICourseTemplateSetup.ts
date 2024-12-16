/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ICourseTemplateSetup.ts */

export interface ICourseTemplateSetup {
    assignmentWeightingMethod: number;
    automaticOverallGrades: boolean;
    createdBy: number;
    defaultGradeMapping: boolean;
    isDateByAssignmentType?: boolean;
    isRestrictive: boolean;
    name: string;
    templateId: number;
    sessionPeriodId?: number;
    useWeightedAssignmentTypes: boolean;
}