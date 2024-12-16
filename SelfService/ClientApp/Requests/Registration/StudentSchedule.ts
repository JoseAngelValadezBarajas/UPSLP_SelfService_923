/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: StudentSchedule.ts */

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const StudentScheduleRequests = {
    getSchedulePeriods(
        resolver: (json: string) => void,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getSchedulePeriods.name, '/Periods/StudentSchedule',
            { impersonateInfo }, resolver);
    },
    postConEdScheduleList(
        resolver: (json: string) => void,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.postScheduleList.name, '/Schedule/StudentConEd',
            { impersonateInfo }, resolver);
    },
    postEditPermissionRequest(id: number,
        comments: string,
        resolver: (json: string) => void): void {
        Request.post(this.postEditPermissionRequest.name, '/Students/EditPermissionRequest',
            { id, comments }, resolver);
    },
    postScheduleList(
        yearTermSession: string,
        resolver: (json: string) => void,
        impersonateInfo?: IImpersonateInfo): void {
        const split = yearTermSession.split('/');
        const data = {
            yearTermSession: {
                year: split[0],
                term: split[1],
                session: split.length >= 3 ? split[2] : ''
            },
            impersonateInfo
        };
        Request.post(this.postScheduleList.name, '/Schedule/Student', data, resolver);
    }
};

export default StudentScheduleRequests;