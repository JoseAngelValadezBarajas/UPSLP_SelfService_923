/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: TransferCourses.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const TransferCourses = {
    getCatalogCourseList(organizationId: number, transferEvent: string, startIndex: number, length: number,
        resolver: (json: string) => void): void {
        Request.post(this.getOrganizationList.name,
            '/TransferCatalog/CatalogCourseList',
            {
                organizationId,
                transferEvent,
                startIndex,
                length
            }, resolver);
    },
    getCourseDetail(courseCode: string, resolver: (json: string) => void,
        startIndex?: number, length?: number): void {
        Request.post(this.getCourseDetail.name, '/Courses', { courseCode, startIndex, length },
            resolver);
    },
    getOrganizationList(name: string, startIndex: number, length: number,
        resolver: (json: string) => void): void {
        Request.post(this.getOrganizationList.name,
            '/TransferCatalog/OrganizationList',
            {
                name,
                startIndex,
                length
            }, resolver);
    }
};

// Export object with the requests
export default TransferCourses;