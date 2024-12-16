/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IInstructorSetupPermissions.ts */

export interface IInstructorSetupPermissions {
    advisorWarnings: boolean;
    associationHead: boolean;
    associationFacultyDossier: boolean;
    campusCoordinator: boolean;
    campusCoordinatorFacultyDossier: boolean;
    courseManagement: boolean;
    departmentHead: boolean;
    departmentHeadFacultyDossier: boolean;
    offices: boolean;
    officesFacultyDossier: boolean;
}

export enum InstructorSetupTabs {
    AdvisorWarnings = 1,
    AssociationHead = 3,
    CampusCoordinator = 4,
    CourseManagement = 0,
    DepartmentHead = 2,
    Offices = 5
}