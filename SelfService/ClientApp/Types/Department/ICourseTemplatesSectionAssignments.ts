/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ICourseTemplatesSectionAssignments.ts */

export interface ICourseTemplatesSectionAssignments {
    academicSession: string;
    academicTerm: string;
    academicYear: string;
    checked: boolean;
    eventId: string;
    eventName: string;
    eventSubType: string;
    hasActivities: boolean;
    hasGrades: boolean;
    hasPostedGrades: boolean;
    hasTemplate: boolean;
    sectionId: number;
    sectionIdentifier: string;
    sessionDesc: string;
    sessionPeriodId: number;
    termDesc: string;
}