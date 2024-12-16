/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: DepartmentHead.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IDepartmentHeadSave } from '../../Types/Administration/IDepartmentHead';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const DepartmentHeadRequests = {
    getDepartmentHeads(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getDepartmentHeads.name, '/DepartmentHeads', null, resolver, resolveError);
    },
    getDepartmentHeadsOptions(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getDepartmentHeadsOptions.name, '/CodeTables/Departments', null, resolver, resolveError);
    },
    postFacultyHasDepartment(departmentId: number, personId: number,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postFacultyHasDepartment.name, '/DepartmentHeads/FacultyHasDepartment',
            { departmentId, personId }, resolver, resolveError);
    },
    postDeleteDepartmentHead(departmentHeadId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postDeleteDepartmentHead.name, '/DepartmentHeads/Delete', departmentHeadId, resolver, resolveError);
    },
    postSaveDepartmentHead(departmentHead: IDepartmentHeadSave,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveDepartmentHead.name, '/DepartmentHeads/Save', departmentHead, resolver, resolveError);
    }
};

// Export object with the requests
export default DepartmentHeadRequests;