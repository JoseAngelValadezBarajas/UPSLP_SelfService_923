/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ICourseManagementMainPermissions.ts */

export interface ICourseManagementMainPermissions {
    classesActivitiesSetup: boolean;
    classesActivityGrades: boolean;
    classesAlerts: boolean;
    classesAttendance: boolean;
    classesClassList: boolean;
    classesClassListDossier: boolean;
    classesDailyAttendance: boolean;
    classesDashboardNotes: boolean;
    classesGradeMappings: boolean;
    classesManageAssistants: boolean;
    classesManageAssistantsDossier: boolean;
    classesManageAssistantsGrantActivities: boolean;
    classesManageAssistantsGrantActivityGrades: boolean;
    classesManageAssistantsGrantAlerts: boolean;
    classesManageAssistantsGrantClassList: boolean;
    classesManageAssistantsGrantDailyAttendance: boolean;
    classesManageAssistantsGrantDashboardNotes: boolean;
    classesManageAssistantsGrantGradeMappings: boolean;
    classesManageAssistantsGrantOverallAttendance: boolean;
    classesManageAssistantsGrantOverallGrades: boolean;
    classesManageAssistantsGrantOverallGradesSubmission: boolean;
    classesManageAssistantsGrantWaitList: boolean;
    classesOverallGrades: boolean;
    classesOverallGradesChangeOptions: boolean;
    classesPermissionRequest: boolean;
    classesPermissionRequestDossier: boolean;
    classesWaitlist: boolean;
    departmentActivitiesSetup: boolean;
    departmentActivityGrades: boolean;
    departmentAlerts: boolean;
    departmentAttendance: boolean;
    departmentClassList: boolean;
    departmentClassListDossier: boolean;
    departmentDailyAttendance: boolean;
    departmentDashboardNotes: boolean;
    departmentGradeMappings: boolean;
    departmentOverallGrades: boolean;
    departmentOverallGradesChangeOptions: boolean;
    departmentWaitlist: boolean;
}

export enum CourseManagementMainOptions {
    Dashboard = 1,
    ClassList = 2,
    Waitlist = 3,
    PermissionRequest = 4,
    ActivitiesSetup = 5,
    GradeMappings = 6,
    ActivityGrades = 7,
    OverallGrades = 8,
    Alerts = 9,
    Attendance = 10,
    DailyAttendance = 11,
    ManageAssistants = 12
}

export enum CourseManagementMainFilter {
    Department = 1,
    Faculty = 2,
    Year = 3
}