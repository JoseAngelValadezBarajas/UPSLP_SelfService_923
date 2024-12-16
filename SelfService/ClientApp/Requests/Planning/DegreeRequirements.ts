/* Copyright 2018-2020 Ellucian Company L.P. and its affiliates.
 * File: DegreeRequirements.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const DegReqsRequests = {
    addToCart(id: number, resolver: (json: string) => void, personId?: number): void {
        Request.post(this.addToCart.name, '/Cart/Create', { id, personId }, resolver);
    },
    addToWaitlist(id: number, resolver: (json: string) => void, personId?: number): void {
        Request.post(this.addToWaitlist.name, '/Waitlist/Create', { id, personId }, resolver);
    },
    getAcademicPlan(yearTerm: string, program: string, degree: string,
        resolver: (json: string) => void): void {
        Request.post(this.getAcademicPlan.name, '/DegreeRequirements/DegreeRequirements', { yearTerm, program, degree },
            resolver);
    },
    getCourseDetail(courseCode: string, resolver: (json: string) => void,
        startIndex?: number, length?: number): void {
        Request.post(this.getCourseDetail.name, '/Courses', { courseCode, startIndex, length },
            resolver);
    },
    getDegrees(yearTerm: string, program: string, resolver: (json: string) => void): void {
        Request.post(this.getDegrees.name, '/Degrees/DegreeRequirements', { yearTerm, program }, resolver);
    },
    getPeriods(resolver: (json: string) => void): void {
        Request.post(this.getPeriods.name, '/Periods/DegreeRequirements', null, resolver);
    },
    getPrograms(yearTerm: string, resolver: (json: string) => void): void {
        Request.post(this.getPrograms.name, '/Programs/DegreeRequirements', yearTerm , resolver);
    },
    getSectionsByPeriod(eventId: string, resolver: (json: string) => void, personId?: number): void {
        Request.post(this.getSectionsByPeriod.name, '/Sections/ByPeriod', { eventId, personId }, resolver);
    },
    getTakenCourseDetail(year: string,
        term: string,
        session: string,
        eventId: string,
        subType: string,
        section: string,
        status: string,
        resolver: (json: string) => void): void {
        Request.post(this.getTakenCourseDetail.name, '/AcademicPlans/TakenCourseDetail',
            { year, term, session, eventId, subType, section, status },
            resolver);
    },
    getWildCard(resolver: (json: string) => void) {
        Request.post(this.getWildCard.name, '/Settings/WildCard', null, resolver);
    }
};

// Export object with the requests
export default DegReqsRequests;