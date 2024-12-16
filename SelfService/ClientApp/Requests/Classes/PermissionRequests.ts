/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: PermissionRequests.ts */

// Types
import { IPermissionRequestModel } from '../../Types/Students/IPermissionRequestModel';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const PermissionRequestsRequests = {
    getPermissionRequests(sectionId: number,
        resolver: (json: string) => void): void {
        Request.post(this.getPermissionRequests.name, '/Sections/PermissionRequests', sectionId, resolver);
    },
    editPermissionRequests(permissionRequestList: IPermissionRequestModel[], resolver: (json: string) => void): void {
        Request.post(this.editPermissionRequests.name, '/Sections/EditPermissionRequests', permissionRequestList, resolver);
    }
};

// Export object with the requests
export default PermissionRequestsRequests;