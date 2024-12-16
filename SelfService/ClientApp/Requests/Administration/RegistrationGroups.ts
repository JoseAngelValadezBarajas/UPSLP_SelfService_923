/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: RegistrationGroups.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IRegistrationGroupDetail } from '../../Types/RegistrationGroups/IRegistrationGroupDetail';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const RegistrationGroupsRequests = {
    getRegistrationGroup(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getRegistrationGroup.name, `/RegistrationGroups/Details/${id}`, resolver, resolveError);
    },
    getRegistrationGroups(startIndex: number, length: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getRegistrationGroups.name, `/RegistrationGroups/${startIndex}/${length}`, resolver, resolveError);
    },
    postDeleteRegistrationGroup(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postDeleteRegistrationGroup.name, '/RegistrationGroups/Delete', id, resolver, resolveError);
    },
    postPostSaveRegistrationGroup(registrationGroupDetail: IRegistrationGroupDetail, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postPostSaveRegistrationGroup.name, '/RegistrationGroups/Save', registrationGroupDetail, resolver, resolveError);
    },
    postStatus(id: number, isActive: boolean, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postStatus.name, '/RegistrationGroups/Status', { id, isActive }, resolver, resolveError);
    },
    postValidateName(name: string, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateName.name, '/RegistrationGroups/ValidateName', name, resolver, resolveError);
    },
    postValidateSort(sortId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateSort.name, '/RegistrationGroups/ValidateSort', sortId, resolver, resolveError);
    }
};

// Export object with the requests
export default RegistrationGroupsRequests;