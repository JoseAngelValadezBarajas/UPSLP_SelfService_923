/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAttendanceSectionMeeting.ts */

export interface IAttendanceSectionMeeting {
    buildingName: string;
    calendarKey: number;
    campusName: string;
    endTime: string;
    floorId: string;
    missingAttendance: boolean;
    notes?: string;
    roomId: string;
    roomName: string;
    startTime: string;
}