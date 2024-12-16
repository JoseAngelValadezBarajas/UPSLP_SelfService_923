/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: WhatIf.ts */

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';
import { IWhatIfPlan } from '../../Types/WhatIf/IWhatIfPlan';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const WhatIfRequests = {
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
    createWhatIf(whatIfPlan: IWhatIfPlan, resolver: (json: string) => void): void {
        Request.post(this.createWhatIf.name, '/WhatIf/Create', whatIfPlan, resolver);
    },
    deleteWhatIf(whatIfPlan: IWhatIfPlan, resolver: (json: string) => void): void {
        Request.post(this.createWhatIf.name, '/WhatIf/Delete', whatIfPlan, resolver);
    },
    getCourseDetail(courseCode: string, resolver: (json: string) => void,
        startIndex?: number, length?: number): void {
        Request.post(this.getCourseDetail.name, '/Courses', { courseCode, startIndex, length },
            resolver);
    },
    getDegrees(termPeriodId: number, program: string, resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getDegrees.name, '/Degrees/WhatIf', { impersonateInfo, termPeriodId, program }, resolver);
    },
    getPeriods(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getPeriods.name, '/Periods/WhatIf', impersonateInfo, resolver);
    },
    getPrograms(termPeriodId: number, resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getPrograms.name, '/Programs/WhatIf', { termPeriodId, impersonateInfo }, resolver);
    },
    getAvailableWhatIfs(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getAvailableWhatIfs.name, '/WhatIf/Available', { impersonateInfo }, resolver);
    },
    getWhatIf(whatIfPlan: IWhatIfPlan, resolver: (json: string) => void): void {
        Request.post(this.getWhatIf.name, '/WhatIf', whatIfPlan, resolver);
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
    getSectionsByPeriod(eventId: string, resolver: (json: string) => void, personId?: number): void {
        Request.post(this.getSectionsByPeriod.name, '/Sections/ByPeriod', { eventId, personId }, resolver);
    },
    getWildCard(resolver: (json: string) => void) {
        Request.post(this.getWildCard.name, '/Settings/WildCard', null, resolver);
    }
};
// Export object with the requests
export default WhatIfRequests;