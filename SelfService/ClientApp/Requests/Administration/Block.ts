/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Block.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IBlockRegistrationGroup } from '../../Types/Administration/IBlockRegistrationGroup';
import { IAdvancedSearch } from '../../Types/Section/IAdvancedSearch';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const BlockRequests = {
    getBlockDetail(blockRegistrationGroupId: number, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getBlockDetail.name, '/BlockRegistrationGroup/Details', blockRegistrationGroupId, resolver, resolveError);
    },
    getBlockRegistrationSearchOptions(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getBlockRegistrationSearchOptions.name, '/Sections/BlockRegistrationSearchOptions', null, resolver, resolveError);
    },
    getSectionsTimeConflict(sectionIds: number[], resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getSectionsTimeConflict.name, '/Sections/TimeConflict', sectionIds, resolver, resolveError);
    },
    postBlockRegistrationSearch(sectionSearchParameters: IAdvancedSearch, startIndex: number, length: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postBlockRegistrationSearch.name, '/Sections/BlockRegistrationSearch',
            { sectionSearchParameters, startIndex, length }, resolver, resolveError);
    },
    saveBlock(blockRegistrationGroup: IBlockRegistrationGroup, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.saveBlock.name, '/BlockRegistrationGroup/Save', blockRegistrationGroup, resolver, resolveError);
    },
    validateBlock(name: string, termPeriodId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.validateBlock.name, '/BlockRegistrationGroup/Validate', { name, termPeriodId }, resolver, resolveError);
    }
};

// Export object with the requests
export default BlockRequests;