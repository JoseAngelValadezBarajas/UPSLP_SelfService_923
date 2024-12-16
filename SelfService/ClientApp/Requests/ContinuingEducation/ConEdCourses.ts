/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ConEdCourses.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPaymentDiscountCoupon } from '../../Types/Payment/IPaymentDiscountCoupon';
import { IAdvancedSearch } from '../../Types/Section/IAdvancedSearch';
import { IStudentRegistration } from '../../Types/Students/IStudentRegistration';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const ConEdCoursesRequests = {
    getAdvancedSearchOptions(resolver: (json: string) => void): void {
        Request.post(this.getAdvancedSearchOptions.name, '/Sections/AdvancedSearchOptions', null, resolver);
    },
    getConEdStatus(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getConEdStatus.name, '/Sections/ConEdStatus', null, resolver, resolveError);
    },
    postAddToCart(id: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void,
        personId?: number): void {
        Request.post(this.postAddToCart.name, '/Cart/Create', { id, personId }, resolver, resolveError);
    },
    postAddToWaitlist(id: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void,
        personId?: number): void {
        Request.post(this.postAddToWaitlist.name, '/Waitlist/Create', { id, personId }, resolver, resolveError);
    },
    postAdvancedSearchOptions(advancedOptions: IAdvancedSearch,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postAdvancedSearchOptions.name, '/Sections/ConEdAdvancedSearch', advancedOptions, resolver, resolveError);
    },
    postApplyCoupon(discountCoupon: IPaymentDiscountCoupon,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postApplyCoupon.name, '/Students/ConEdApplyDiscountCoupon',
            discountCoupon, resolver, resolveError);
    },
    postDropRegistration(sectionId: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postDropRegistration.name, '/Students/DropConEdRegistration', sectionId, resolver, resolveError);
    },
    postEditCreditType(id: number,
        creditType: string,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postEditCreditType.name,
            '/Cart/EditCreditType',
            { id, creditType },
            resolver,
            resolveError);
    },
    postEditPermissionRequest(id: number,
        comments: string,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postEditPermissionRequest.name,
            '/Students/EditPermissionRequest',
            { id, comments },
            resolver,
            resolveError);
    },
    postRemoveCoupon(discountCoupon: IPaymentDiscountCoupon,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postApplyCoupon.name, '/Students/ConEdRemoveDiscountCoupon',
            discountCoupon, resolver, resolveError);
    },
    postRemoveFromCart(id: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postRemoveFromCart.name, '/Cart/Delete', id, resolver, resolveError);
    },
    postRemoveFromWaitlist(id: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postRemoveFromWaitlist.name, '/Waitlist/Delete', id, resolver, resolveError);
    },
    postSavePermissionRequest(id: number,
        comments: string,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSavePermissionRequest.name, '/Students/SavePermissionRequest', { id, comments }, resolver, resolveError);
    },
    postScheduleList(
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void,
        signal: AbortSignal): void {
        Request.post(this.postScheduleList.name, '/Schedule/StudentConEdCourses', null, resolver, resolveError, signal);
    },
    postSections(keyWords: string | undefined,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSections.name, '/Sections/ConEd', keyWords, resolver, resolveError);
    },
    postStudentRegistration(sections: IStudentRegistration,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postStudentRegistration.name, '/Students/ConEdRegistration', sections, resolver, resolveError);
    }
};

// Export object with the requests
export default ConEdCoursesRequests;