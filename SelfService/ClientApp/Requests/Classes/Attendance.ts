/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Attendance.ts */

// Types
import { IAttendanceStudentList } from '../../Types/Section/IAttendanceStudentList';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const AttendanceRequests = {
    getAttendance(id: number, resolver: (json: string) => void): void {
        Request.get(this.getAttendance.name, `/Sections/Attendance/${id}`, resolver);
    },
    postSaveAttendance(attendanceList: IAttendanceStudentList[], resolver: (json: string) => void): void {
        Request.post(this.postSaveAttendance.name, '/Sections/Attendance', attendanceList, resolver);
    }
};

// Export object with the requests
export default AttendanceRequests;