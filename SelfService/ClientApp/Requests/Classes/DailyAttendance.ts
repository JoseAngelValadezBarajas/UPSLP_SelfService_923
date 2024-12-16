/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: DailyAttendance.ts */

// Types
import { IAttendanceDailySave } from '../../Types/Section/IAttendanceDailySave';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const DailyAttendanceRequests = {
    getAttendanceDailyCalendar(id: number, resolver: (json: string) => void): void {
        Request.post(this.getAttendanceDailyCalendar.name, '/Sections/DailyAttendance', id, resolver);
    },
    getAttendanceDailyHours(id: number, calendarDate: string, includeStudentList: boolean, calendarKey: number,
        resolver: (json: string) => void): void {
        Request.post(this.getAttendanceDailyHours.name, '/Sections/DailyAttendanceHours',{ id, calendarDate, includeStudentList, calendarKey }, resolver);
    },
    getAttendanceStudentDaily(id: number, calendarKey: number, resolver: (json: string) => void): void {
        Request.post(this.getAttendanceStudentDaily.name, '/Sections/StudentDailyAttendance', { id, calendarKey }, resolver);
    },
    postSaveAttendanceDaily(attendances: IAttendanceDailySave[], resolver: (json: string) => void): void {
        Request.post(this.postSaveAttendanceDaily.name, '/Sections/DailyAttendance/Save', attendances, resolver);
    },
    postSaveAttendanceDailyBatch(attendance: IAttendanceDailySave, resolver: (json: string) => void): void {
        Request.post(this.postSaveAttendanceDailyBatch.name, '/Sections/DailyAttendance/Batch', attendance, resolver);
    },
    saveCalendarNotes(calendarKey: number, notes: string | null, resolver: (json: string) => void): void {
        Request.post(this.postSaveAttendanceDailyBatch.name, '/Sections/CalendarNotes/Save', { calendarKey, notes }, resolver);
    }
};

// Export object with the requests
export default DailyAttendanceRequests;