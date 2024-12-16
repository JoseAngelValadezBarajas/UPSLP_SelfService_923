/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAttendanceStudentMeeting.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';

export interface IAttendanceStudentMeeting extends IAvatar {
    attendanceStatus: number;
    attendanceStatusDesc: string;
    comments: string;
    hasPicture: boolean;
    peopleId: string;
    studentMeetingAttendanceId: number;
    withdrawn: false;
}