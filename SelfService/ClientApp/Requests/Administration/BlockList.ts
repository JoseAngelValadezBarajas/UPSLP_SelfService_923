/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: BlockList.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IBlockRegistrationGroupSearch } from '../../Types/Administration/IBlockRegistrationGroup';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const BlockListRequests = {
    getBlockDetail(blockRegistrationGroupId: number, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getBlockDetail.name, '/BlockRegistrationGroup/Details', blockRegistrationGroupId, resolver, resolveError);
    },
    getBlocks(blockRegistrationGroupSearch: IBlockRegistrationGroupSearch, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getBlocks.name, '/BlockRegistrationGroup', blockRegistrationGroupSearch, resolver, resolveError);
    },
    getTimeConflicts(blockRegistrationGroupId: number, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void, signal: AbortSignal): void {
        Request.post(this.getTimeConflicts.name, '/BlockRegistrationGroup/HasTimeConflict',
            blockRegistrationGroupId, resolver, resolveError, signal);
    },
    postEnableBlock(blockRegistrationGroupId: number, isActive: boolean, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postEnableBlock.name, '/BlockRegistrationGroup/Status', { blockRegistrationGroupId, isActive }, resolver, resolveError);
    }
};

// Export object with the requests
export default BlockListRequests;