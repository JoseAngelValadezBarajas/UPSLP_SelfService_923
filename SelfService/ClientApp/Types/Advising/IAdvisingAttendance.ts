/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAdvisingAttendance.ts */

import { IAdvisingAttendanceList } from './IAdvisingAttendanceList';

export interface IAdvisingAttendance {
    attendanceCourses: IAdvisingAttendanceList[];
    sessionDesc: string;
    showLowAttendanceWarning: boolean;
}