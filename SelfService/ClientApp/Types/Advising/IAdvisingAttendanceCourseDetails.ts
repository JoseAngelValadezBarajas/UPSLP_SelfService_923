/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IAdvisingAttendanceCourseDetails.ts */

export interface IAdvisingAttendanceCourseDetails {
    hasLowAttendance: boolean;
    section: string;
    sectionCreditType: string;
    sectionEventId: string;
    sectionEventSubType: string;
    sectionId: number;
    sectionLongName: string;
    sectionType: string;
    session: string;
    term: string;
    year: number;
    overallStatus: string;
}