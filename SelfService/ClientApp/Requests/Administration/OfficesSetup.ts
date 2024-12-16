/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: OfficesSetup.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';
import { IOfficePermission } from '../../Types/Administration/IOfficePermission';

// Functions for requests
const OfficesSetupRequests = {
    getOfficesWithStaff(resolver: (json: string) => void): void {
        Request.post(this.getOfficesWithStaff.name, '/Offices', null, resolver);
    },
    getOfficeStaff(officeId: number, startIndex: number, length: number, resolver: (json: string) => void): void {
        Request.get(this.getOfficeStaff.name, `/Offices/OfficeStaff/${officeId}/${startIndex}/${length}`, resolver);
    },
    saveOfficeStaff(personId: number, staffPermissions: IOfficePermission[], resolver: (json: string) => void): void {
        Request.post(this.saveOfficeStaff.name, '/Offices/OfficeStaff/Save', { personId, staffPermissions }, resolver);
    },
    updateStaffPermission(staffPermission: IOfficePermission, resolver: (json: string) => void): void {
        Request.post(this.updateStaffPermission.name, '/Offices/StaffPermissions/Update', staffPermission, resolver);
    },
    getStaffPermissions(personId: number, resolver: (json: string) => void): void {
        Request.post(this.getOfficesWithStaff.name, '/Offices/StaffPermissions', personId, resolver);
    },
    deleteStaffPermission(staffMemberId: number, resolver: (json: string) => void): void {
        Request.post(this.saveOfficeStaff.name, '/Offices/Delete', staffMemberId, resolver);
    },
    deleteAllStaffPermissions(personId: number, resolver: (json: string) => void): void {
        Request.post(this.saveOfficeStaff.name, '/Offices/DeleteAll', personId, resolver);
    },
};

// Export object with the requests
export default OfficesSetupRequests;