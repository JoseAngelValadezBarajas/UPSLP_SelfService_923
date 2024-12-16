/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAttendanceDaily.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAttendanceSectionMeeting } from './IAttendanceSectionMeeting';
import { IAttendanceStudentMeeting } from './IAttendanceStudentMeeting';

export interface IAttendanceDaily {
    calendarDate: string;
    listOptionViewModel: IDropDownOption[];
    longDate: string;
    sectionMeetingCalendarViewModels: IAttendanceSectionMeeting[];
    studentMeetingAttendanceViewModels: IAttendanceStudentMeeting[];
}