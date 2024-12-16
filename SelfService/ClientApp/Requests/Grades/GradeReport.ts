/* Copyright 2018-2022 Ellucian Company L.P. and its affiliates.
 * File: GradeReport.ts */

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const GradeReportRequests = {
    postActivityGradesReport(sectionId: number,
        resolver: (json: string) => void,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.postActivityGradesReport.name, '/Students/ActivityGrades', { impersonateInfo, sectionId }, resolver);
    },
    postReport(termPeriodId: number,
        resolver: (json: string) => void,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.postReport.name, '/Students/Grades', { impersonateInfo, termPeriodId }, resolver);
    },
    getPeriod(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getPeriod.name, `/Periods/GradeReport/`, { impersonateInfo } ,resolver);
    },
    getStopList(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getStopList.name, `/People/StopList/`, { impersonateInfo },  resolver);
    }
};

// Export object with the requests
export default GradeReportRequests;