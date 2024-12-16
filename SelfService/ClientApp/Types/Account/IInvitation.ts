/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IInvitation.ts */

export interface IInvitation {
    canViewAcademicPlan: boolean;
    canViewActivityGrades: boolean;
    canViewAddress: boolean;
    canViewBalance: boolean;
    canViewFinancialAid: boolean;
    canViewGradeReport: boolean;
    canViewSchedule: boolean;
    canViewStopList: boolean;
    canViewTranscript: boolean;
    email?: string;
    invitationId: number;
    relationId?: number;
    requestToken?: string;
    studentId: number
}