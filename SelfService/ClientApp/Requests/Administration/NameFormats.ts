/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: NameFormats.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { INameFormatList } from '../../Types/NameFormat/INameFormatList';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const NameFormatsRequests = {
    getNameFormat(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getNameFormat.name, `/NameFormats/Details/${id}`, resolver, resolveError);
    },
    getNameFormatExamples(resolver: (json: string) => void): void {
        Request.post(this.postStatus.name, '/Settings/NameFormat', null, resolver);
    },
    getNameFormats(startIndex: number, length: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getNameFormats.name, `/NameFormats/List/${startIndex}/${length}`, resolver, resolveError);
    },
    postDelete(nameFormatId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postStatus.name, '/NameFormats/Delete', nameFormatId, resolver, resolveError);
    },
    postPostSaveNameFormat(nameFormatItem: INameFormatList, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postPostSaveNameFormat.name, '/NameFormats/Save', nameFormatItem, resolver, resolveError);
    },
    postStatus(id: number, isActive: boolean, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postStatus.name, '/NameFormats/Status', { id, isActive }, resolver, resolveError);
    },
    saveNameFormatExamples(examples: string, resolver: (json: string) => void): void {
        Request.post(this.postStatus.name, '/Settings/NameFormat/Save', examples, resolver);
    }
};

// Export object with the requests
export default NameFormatsRequests;