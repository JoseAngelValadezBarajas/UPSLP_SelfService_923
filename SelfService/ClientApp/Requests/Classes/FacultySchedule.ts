/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: FacultySchedule.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const FacultyScheduleRequests = {
    getScheduleList(yearTermSession: string, resolver: (json: string) => void): void {
        const split = yearTermSession.split('/');
        const session = split[2] ? split[2] : '';
        const data = { year: split[0], term: split[1], session: session };
        Request.post(this.getScheduleList.name, '/Schedule/Faculty', data, resolver);
    },
    getSchedulePeriods(resolver: (json: string) => void): void {
        Request.get(this.getSchedulePeriods.name, '/Periods/FacultySchedule', resolver);
    },
    getConEdScheduleList(resolver: (json: string) => void): void {
        Request.post(this.getConEdScheduleList.name, '/Schedule/FacultyConEd', null, resolver);
    },
};

export default FacultyScheduleRequests;