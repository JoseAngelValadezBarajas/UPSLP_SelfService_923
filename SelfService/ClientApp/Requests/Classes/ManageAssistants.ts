/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ManageAssistants.ts */

// Types
import { IFacultyAssistant } from '../../Types/FacultyAssistants/IFacultyAssistant';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const ManageAssistantsRequests = {
    getAssistantDefaultRole(resolver: (json: string) => void): void {
        Request.post(this.getFacultyAssistants.name, '/FacultyAssistants/DefaultRole', null, resolver);
    },
    getFacultyAssistants(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.getFacultyAssistants.name, '/FacultyAssistants', sectionId, resolver);
    },
    getDetailFacultyAssistants(sectionId: number, resolver: (json: string) => void): void {
        Request.post(this.getDetailFacultyAssistants.name, '/FacultyAssistants/Detail', sectionId, resolver);
    },
    saveFacultyAssistant(facultyAssistants: IFacultyAssistant[], resolver: (json: string) => void): void {
        Request.post(this.saveFacultyAssistant.name, '/FacultyAssistants/Save', facultyAssistants, resolver);
    },
    deleteFacultyAssistant(facultyAssistantId: number,
        assistantId: number,
        sectionId: number,
        resolver: (json: string) => void): void {
        Request.post(this.deleteFacultyAssistant.name, '/FacultyAssistants/Delete', {
            facultyAssistantId, assistantId, sectionId
        }, resolver);
    }
};

// Export object with the requests
export default ManageAssistantsRequests;