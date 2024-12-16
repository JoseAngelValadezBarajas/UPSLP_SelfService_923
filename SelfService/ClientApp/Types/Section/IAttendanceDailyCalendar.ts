/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: IAttendanceDailyCalendar.ts */

export interface IAttendanceDailyCalendar {
    calendarDateSelected: string;
    calendarDates: IDateAttendance[];
    // UI
    calendarMissingDates: string[];
    calendarTakenDates: string[];
}

export interface IDateAttendance {
    calendarDate: string;
    missingAttendance: boolean;
}