/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: SharedAdvisees.ts */

// Types
import { IShareAdvisees } from '../../Types/Advisees/IShareAdvisees';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const SharedAdviseesRequests = {
    deleteSharedAdvisees(advisees: number[], resolver: (json: string) => void): void {
        Request.post(this.deleteSharedAdvisees.name, '/Advisees/SharedAdvisees/Delete', advisees, resolver);
    },
    deleteSharedAdviseeAdvisor(sharedAdvisee: IShareAdvisees, resolver: (json: string) => void): void {
        Request.post(this.deleteSharedAdviseeAdvisor.name, '/Advisees/SharedAdvisees/DeleteAdvisor', sharedAdvisee, resolver);
    },
    getAdvisors(id: number, resolver: (json: string) => void): void {
        Request.post(this.getAdvisors.name, '/Advisees/Advisors', id, resolver);
    },
    getSharedAdvisees(startIndex: number, length: number, resolver: (json: string) => void): void {
        Request.post(this.getSharedAdvisees.name, '/Advisees/Shared', { startIndex, length }, resolver);
    },
    getStaffEmail(resolver: (json: string) => void): void {
        Request.post(this.getStaffEmail.name, '/Settings/StaffEmail', null, resolver);
    }
};

// Export object with the requests
export default SharedAdviseesRequests;