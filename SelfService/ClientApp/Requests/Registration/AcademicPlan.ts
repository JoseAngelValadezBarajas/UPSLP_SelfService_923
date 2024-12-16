/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AcademicPlan.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Functions for requests
const AcademicPlanRequests = {
    addToCart(id: number,
        resolver: (json: string) => void,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.addToCart.name, '/Cart/Create', { id, impersonateInfo }, resolver);
    },
    addToWaitlist(id: number,
        resolver: (json: string) => void,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.addToWaitlist.name, '/Waitlist/Create', { id, impersonateInfo }, resolver);
    },
    getAvailableAcademicPlans(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getAvailableAcademicPlans.name, '/AcademicPlans/Available', { impersonateInfo }, resolver);
    },
    getCourseDetail(courseCode: string, resolver: (json: string) => void,
        startIndex?: number, length?: number): void {
        Request.post(this.getCourseDetail.name, '/Courses', { courseCode, startIndex, length },
            resolver);
    },
    getDefaultAcademicPlan(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getDefaultAcademicPlan.name, '/AcademicPlans/Default', { impersonateInfo }, resolver);
    },
    getAcademicPlan(year: string,
        term: string,
        program: string,
        degree: string,
        curriculum: string,
        resolver: (json: string) => void,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getAcademicPlan.name,
            '/AcademicPlans',
            { year, term, impersonateInfo, program, degree, curriculum },
            resolver);
    },
    getTakenCourseDetail(year: string,
        term: string,
        session: string,
        eventId: string,
        subType: string,
        section: string,
        status: string,
        resolver: (json: string) => void,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getTakenCourseDetail.name,
            '/AcademicPlans/TakenCourseDetail',
            { year, term, session, eventId, subType, section, status, impersonateInfo },
            resolver);
    },
    getSectionsByPeriod(eventId: string, eventSubType: string, resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo
    ): void {
        Request.post(this.getSectionsByPeriod.name,
            '/Sections/ByPeriod',
            { eventId, eventSubType, impersonateInfo },
            resolver);
    },
    getWildCard(resolver: (json: string) => void) {
        Request.post(this.getWildCard.name,
            '/Settings/WildCard',
            null,
            resolver);
    }
};
// Export object with the requests
export default AcademicPlanRequests;