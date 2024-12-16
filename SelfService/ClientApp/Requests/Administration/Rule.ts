/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Rule.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IBlockRegistrationRule, IBlockRegistrationRuleSearch } from '../../Types/Administration/IBlockRegistrationRule';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const RuleRequests = {
    saveRule(blockRegistrationRule: IBlockRegistrationRule, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.saveRule.name, '/BlockRegistrationRule/Save', blockRegistrationRule, resolver, resolveError);
    },
    validatePriority(priority: number, termPeriodId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.validatePriority.name, '/BlockRegistrationRule/ValidatePriority', { priority, termPeriodId }, resolver, resolveError);
    },
    validateRuleName(name: string, termPeriodId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.validateRuleName.name, '/BlockRegistrationRule/ValidateName', { name, termPeriodId }, resolver, resolveError);
    },
    validateGroupName(name: string,
        blockRegistrationRuleId: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.validateGroupName.name, '/BlockRegistrationRule/ValidateGroupName',
            { name, blockRegistrationRuleId }, resolver, resolveError);
    },
    getDetails(resolver: (json: string) => void, resolveError: (logData: ILogData) => void, id?: number): void {
        Request.post(this.getDetails.name, '/BlockRegistrationRule/Details',  id , resolver, resolveError);
    },
    getRules(blockRegistrationRuleSearch: IBlockRegistrationRuleSearch,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getRules.name, '/BlockRegistrationRule', blockRegistrationRuleSearch, resolver, resolveError);
    },
    postEnableRule(blockRegistrationRuleId: number, isActive: boolean, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postEnableRule.name, '/BlockRegistrationRule/Status', { blockRegistrationRuleId, isActive }, resolver, resolveError);
    }
};

// Export object with the requests
export default RuleRequests;