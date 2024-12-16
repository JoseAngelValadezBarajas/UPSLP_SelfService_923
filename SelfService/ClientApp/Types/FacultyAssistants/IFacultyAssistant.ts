/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IFacultyAssistant.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';

export interface IFacultyAssistant {
    assistantId: number;
    canAccessActivityGrades: boolean;
    canAccessAttendance: boolean;
    canAccessClassList: boolean;
    canAccessDashboardNotes: boolean;
    canAccessOverallGrades: boolean;
    canAccessViolations: boolean;
    canAccessWaitlist: boolean;
    canSetupActivities: boolean;
    canSetupGradeMappings: boolean;
    canSubmitOverallGrades: boolean;
    canTakeDailyAttendance: boolean;
    facultyAssistantId: number;
    facultyId: number;
    sectionId: number;
}

export interface IFacultyAssistantDetail extends IFacultyAssistant{
    assistant: IAvatar;
    createDate: string;
    isWithdrawn: boolean;
    revisionDate: string;
    email: string;

    // UI
    isModified: boolean;
    checkbox: boolean;
}