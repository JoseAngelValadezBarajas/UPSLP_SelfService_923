/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Students.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const StudentsRequests = {
    getStudents(resolver: (json: string) => void): void {
        Request.post(this.getStudents.name, '/Invitations/Students', null, resolver);
    },
    getProfileClaims(studentId: number,
        resolver: (json: string) => void): void {
        Request.post(this.getProfileClaims.name, '/Invitations/Students/Options', studentId, resolver);
    },
};

// Export object with the requests
export default StudentsRequests;