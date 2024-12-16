/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: Courses.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IYearTerm } from '../../Types/Generic/IYearTerm';
import { IAdvancedSearch } from '../../Types/Section/IAdvancedSearch';
import { IStudentBlockRegRuleGroupBlock } from '../../Types/Students/IStudentBlockRegRuleGroupBlock';
import { IStudentRegistration } from '../../Types/Students/IStudentRegistration';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const CoursesRequests = {
    getAdvancedSearchOptions(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getAdvancedSearchOptions.name, '/Sections/AdvancedSearchOptions', null, resolver, resolveError);
    },
    getBlock(blockRegistrationRuleGroupId: number, blockRegRuleGroupBlockId: number, yearTerm: IYearTerm,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getRule.name, '/BlockRegistration/Block', { blockRegistrationRuleGroupId, blockRegRuleGroupBlockId, yearTerm },
            resolver, resolveError);
    },
    getBlocks(blockRegistrationRuleGroupId: number, yearTerm: IYearTerm,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void,
        signal: AbortSignal): void {
        Request.post(this.getRule.name, '/BlockRegistration/Blocks', { blockRegistrationRuleGroupId, yearTerm },
            resolver, resolveError, signal);
    },
    getPeriods(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getPeriods.name, '/Periods/Registration', null, resolver, resolveError);
    },
    getRegistrationSummary(id: number, resolver: (json: string) => void): void {
        Request.post(this.getRegistrationSummary.name, '/Students/RegistrationSummary', id, resolver);
    },
    getRule(yearTerm: IYearTerm, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getRule.name, '/BlockRegistration/Rule', yearTerm, resolver, resolveError);
    },
    postAddToCart(id: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void,
        personId?: number): void {
        Request.post(this.postAddToCart.name, '/Cart/Create', { id, personId }, resolver, resolveError);
    },
    postAddBlock(block: IStudentBlockRegRuleGroupBlock,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postAddBlock.name, '/BlockRegistration/Block/Add', block, resolver, resolveError);
    },
    postAddToWaitlist(id: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void,
        personId?: number): void {
        Request.post(this.postAddToWaitlist.name, '/Waitlist/Create', { id, personId }, resolver, resolveError);
    },
    postAdvancedSearchOptions(advancedOptions: IAdvancedSearch,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void,
        signal: AbortSignal): void {
        Request.post(this.postAdvancedSearchOptions.name, '/Sections/AdvancedSearch', advancedOptions, resolver, resolveError, signal);
    },
    postDropBlock(block: IStudentBlockRegRuleGroupBlock,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postRemoveBlock.name, '/BlockRegistration/Block/Drop', block, resolver, resolveError);
    },
    postDropRegistration(sectionId: number,
        yearTerm: string,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postDropRegistration.name, '/Students/DropRegistration', { yearTerm, sectionId }, resolver, resolveError);
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
    postRemoveBlock(block: IStudentBlockRegRuleGroupBlock,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postRemoveBlock.name, '/BlockRegistration/Block/Remove', block, resolver, resolveError);
    },
    postRemoveCartSections(sections: number[],
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postRemoveCartSections.name, '/BlockRegistration/RemoveCartSections', sections, resolver, resolveError);
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
    postScheduleList(yearTerm: string,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void,
        signal: AbortSignal): void {
        const split = yearTerm.split('/');
        Request.post(this.postScheduleList.name, '/Schedule/StudentCourses', { year: split[0], term: split[1] }, resolver, resolveError, signal);
    },
    postSections(keyWords: string | undefined,
        yearTerm: string,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void,
        signal: AbortSignal): void {
        Request.post(this.postSections.name, '/Sections', { keyWords, yearTerm }, resolver, resolveError, signal);
    },
    postStudentRegistration(yearTerm: string,
        sections: IStudentRegistration,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postStudentRegistration.name, '/Students/Registration', { yearTerm, sections }, resolver, resolveError);
    }
};

// Export object with the requests
export default CoursesRequests;