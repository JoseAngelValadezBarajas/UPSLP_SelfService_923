/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ApproveGrades.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const ApproveGradesRequests = {
    getPeriods(resolver: (json: string) => void): void {
        Request.post(this.getPeriods.name, '/Periods/ApproveGrades', null, resolver);
    },
    getSections(sessionPeriodId: number, resolver: (json: string) => void): void {
        Request.post(this.getSections.name, '/Sections/ApproveGrades', sessionPeriodId, resolver);
    },
    getSection(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.getSection.name, '/Sections/ApproveGrades/Section', sectionId, resolver);
    }
};

// Export object with the requests
export default ApproveGradesRequests;