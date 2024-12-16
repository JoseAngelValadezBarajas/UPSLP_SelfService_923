/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: Section.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IAdvancedSearch } from '../../Types/Section/IAdvancedSearch';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const SectionRequests = {
    getSearchOptions(sectionSearchParameters: IAdvancedSearch,
        startIndex: number,
        length: number,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(
            this.getSearchOptions.name,
            '/Sections/Search',
            { sectionSearchParameters, startIndex, length },
            resolver,
            resolveError);
    }
};

// Export object with the requests
export default SectionRequests;