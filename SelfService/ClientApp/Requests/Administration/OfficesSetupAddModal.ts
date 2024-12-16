/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: OfficesSetupAddModal.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AddStaffRequests = {
    getAvailableOfficesForStaff(personId, resolver: (json: string) => void): void {
        Request.post(this.getAvailableOfficesForStaff.name, '/Offices/AvailableForStaff', personId, resolver);
    }
};

// Export object with the requests
export default AddStaffRequests;