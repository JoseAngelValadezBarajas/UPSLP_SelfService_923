/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: Course.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ICourseCatalogSearch } from '../../Types/Course/ICourseCatalogSearch';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const CourseRequests = {
    getSearchOptions(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(
            this.getSearchOptions.name,
            '/Courses/Search/Options',
            null, resolver, resolveError);
    },
    getCourseCatalogResults(courseCatalogSearch: ICourseCatalogSearch,
        startIndex: number, length: number,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(
            this.getCourseCatalogResults.name,
            '/Courses/Search',
            {
                courseCatalogSearch: courseCatalogSearch,
                length: length,
                startIndex: startIndex
            },
            resolver,
            resolveError);
    },
    getCourseDetail(courseCode: string, startIndex: number | undefined, length: number | undefined,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getCourseDetail.name,
            '/Courses',
            { courseCode, startIndex, length },
            resolver,
            resolveError);
    },
};

// Export object with the requests
export default CourseRequests;