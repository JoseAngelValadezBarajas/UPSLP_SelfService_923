/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: StudentRecords.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IStudentRecords } from '../../Types/InstitutionSettings/IStudentRecords';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const StudentRecordsRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSettings.name, '/Settings/Transcript', resolver, resolveError);
    },
    postSaveSettings(studentRecords: IStudentRecords, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/Transcript', studentRecords, resolver, resolveError);
    }
};

// Export object with the requests
export default StudentRecordsRequests;