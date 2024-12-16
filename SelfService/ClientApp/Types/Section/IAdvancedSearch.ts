/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IAdvancedSearch.ts */

export interface IAdvancedSearch {
    campusId?: string;
    classLevel?: string;
    college?: string;
    creditType?: string;
    curriculum?: string;
    department?: string;
    endDate?: string;
    endTime?: string;
    eventId?: string;
    eventSubType?: string;
    eventType?: string;
    generalEd?: string;
    instructorId?: number;
    keywords?: string;
    meeting?: string;
    nonTradProgram?: string;
    period?: string;
    periodId?: number;
    population?: string;
    program?: string;
    registrationType?: string;
    session?: string;
    startDate?: string;
    startTime?: string;
    status?: string;
    // UI Functionality
    campusIdText?: string;
    endDateText?: string;
    endTimeText?: string;
    eventSubTypeText?: string;
    eventTypeText?: string;
    instructorIdText?: string;
    meetingText?: string;
    sessionText?: string;
    startDateText?: string;
    startTimeText?: string;
    academicTerm?: string;
    academicYear?: string;
}

export enum SectionSearchType {
    None = 0,
    Basic = 1,
    Advanced = 2
}