/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IAdviseeClaims.ts */

export interface IAdviseeClaims {
    academicPlan: boolean;
    academicPlanAddToCart: boolean;
    agreements: boolean;
    alerts: boolean;
    attendance: boolean;
    attendanceDailyAttendance: boolean;
    checklist: boolean;
    checklistCreateActionItem: boolean;
    disabilities: boolean;
    gradeReport: boolean;
    gradeReportCoursework: boolean;
    registrationSummary: boolean
    schedule: boolean;
    scheduleRequests: boolean;
    testScores: boolean;
    unofficialTranscript: boolean;
    whatIf: boolean;
    whatIfAddToCart: boolean;
}