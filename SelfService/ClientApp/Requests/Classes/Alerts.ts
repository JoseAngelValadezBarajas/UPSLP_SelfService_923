/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Alerts.ts */

// Types
import { IStudentViolation } from '../../Types/Students/IStudentViolation';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const AlertsRequests = {
    getAlerts(sectionId: number, resolver: (json: string) => void): void {
        Request.get(this.getAlerts.name, `/Sections/Violations/${sectionId}`, resolver);
    },
    postSaveAlert(alertSaved: IStudentViolation, resolver: (json: string) => void): void {
        Request.post(this.postSaveAlert.name, '/Students/Violations/Save', alertSaved, resolver);
    },
    postDeleteAlert(violationId: number, resolver: (json: string) => void): void {
        Request.post(this.postDeleteAlert.name, '/Students/Violations/Delete', violationId, resolver);
    }
};

// Export object with the requests
export default AlertsRequests;