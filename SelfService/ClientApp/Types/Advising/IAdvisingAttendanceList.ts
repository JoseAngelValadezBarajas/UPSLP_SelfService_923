/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAdvisingAttendanceList.ts */

export interface IAdvisingAttendanceList {
    excusedAbsences: string;
    excusedTardiness: string;
    hasLowAttendance: boolean;
    lastDateAttended: string;
    overallAttendance: string;
    present: string;
    section: string;
    sectionCreditType: string;
    sectionEventId: string;
    sectionEventSubType: string;
    sectionId: number;
    sectionLongName: string;
    sectionType: string;
    transcriptDetailId: number;
    unexcusedAbsences: string;
    unexcusedTardiness: string;
}