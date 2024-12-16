/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: NameFormatCategories.ts */

// Types
import { IDictionary } from '@hedtech/powercampus-design-system/types/IDictionary';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const NameFormatCategoriesRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSettings.name, '/NameFormats/Categories', resolver, resolveError);
    },
    postSaveSettings(nameFormatCategory: IDictionary, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/NameFormats/Categories', nameFormatCategory, resolver, resolveError);
    }
};

// Export object with the requests
export default NameFormatCategoriesRequests;