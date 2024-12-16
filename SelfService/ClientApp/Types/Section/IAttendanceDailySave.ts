/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAttendanceDailySave.ts */

export interface IAttendanceDailySave {
    calendarKey?: number;
    comment?: string;
    meetingAttendanceId?: number;
    meetingDate?: string;
    sectionId?: number;
    studentId?: number;
    studentMeetingAttendanceId?: number;
}