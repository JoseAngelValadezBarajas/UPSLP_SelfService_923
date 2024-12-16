/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ClassList.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const ClassListRequests = {
    getClassList(sectionId: number, status: number, resolver: (json: string) => void): void {
        Request.post(this.getClassList.name, '/Sections/Enrollment', { sectionId, status }, resolver);
    }
};

// Export object with the requests
export default ClassListRequests;