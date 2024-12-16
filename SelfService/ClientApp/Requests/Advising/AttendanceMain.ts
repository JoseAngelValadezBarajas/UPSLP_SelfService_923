/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
* File: AttendanceMain.ts */

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AttendanceMainRequests = {
    getAttendance(termPeriodId: number, resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getAttendance.name, '/Advisees/Attendance', { impersonateInfo, termPeriodId }, resolver);
    },
    getAttendanceDetails(transcriptDetailId: number, resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getAttendanceDetails.name, '/Advisees/Attendance/Details', { impersonateInfo, transcriptDetailId }, resolver);
    },
    getPeriods(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getPeriods.name, '/Periods/Academic', { impersonateInfo }, resolver);
    }
};

// Export object with the requests
export default AttendanceMainRequests;