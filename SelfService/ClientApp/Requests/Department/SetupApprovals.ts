/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: SetupApprovals.ts */

// Types
import { ISectionCourseManagement } from '../../Types/Section/ISectionCourseManagement';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const SetupApprovalsRequests = {
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
        Request.post(this.getSections.name, '/Sections/SetupApprovals', filter, resolver);
    },
    getYears(resolver: (json: string) => void): void {
        Request.post(this.getYears.name, '/DepartmentHeads/Years', null, resolver);
    },
    saveRequireApproval(departmentPosition: number, sectionPosition: number, sectionId: number, requireApproval: boolean,
        resolver: (json: string) => void): void {
        Request.post(this.getYears.name, '/Sections/RequireApproval', {
            departmentPosition,
            requireApproval,
            sectionId,
            sectionPosition
        }, resolver);
    }
};

// Export object with the requests
export default SetupApprovalsRequests;