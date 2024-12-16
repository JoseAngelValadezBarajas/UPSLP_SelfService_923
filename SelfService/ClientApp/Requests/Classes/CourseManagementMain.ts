/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: CourseManagementMain.ts */

// Types
import { ISectionCourseManagement } from '../../Types/Section/ISectionCourseManagement';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const CourseManagementMainRequests = {
    getDepartments(resolver: (json: string) => void): void {
        Request.post(this.getDepartments.name, '/DepartmentHeads/Departments', null, resolver);
    },
    getFaculties(resolver: (json: string) => void): void {
        Request.post(this.getFaculties.name, '/DepartmentHeads/Faculties', null, resolver);
    },
    getPeriods(filter: ISectionCourseManagement, resolver: (json: string) => void): void {
        Request.post(this.getPeriods.name, '/Periods/CourseManagement', filter, resolver);
    },
    getSections(filter: ISectionCourseManagement,
        resolver: (json: string) => void): void {
        Request.post(this.getSections.name, '/Sections/CourseManagement', filter, resolver);
    },
    getYears(resolver: (json: string) => void): void {
        Request.post(this.getYears.name, '/DepartmentHeads/Years', null, resolver);
    }
};

// Export object with the requests
export default CourseManagementMainRequests;