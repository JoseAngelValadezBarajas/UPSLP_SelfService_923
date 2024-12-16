/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ICourseTemplatesAssignmentSections.ts */

export interface ICourseTemplatesAssignmentSections {
    endDate: string;
    eventId: string;
    eventName: string;
    eventSubType: string;
    hasPostedGrades: boolean;
    instructorNames: string[];
    section: string;
    sectionId: number;
    startDate: string;
}