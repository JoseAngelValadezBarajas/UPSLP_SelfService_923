/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: FacultyPages.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IFacultyPages } from '../../Types/InstitutionSettings/IFacultyPages';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const FacultyPagesRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSettings.name, '/Settings/CourseManagement', resolver, resolveError);
    },
    postSaveSettings(facultyPages: IFacultyPages, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/CourseManagement', facultyPages, resolver, resolveError);
    }
};

// Export object with the requests
export default FacultyPagesRequests;