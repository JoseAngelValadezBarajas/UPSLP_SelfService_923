/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: IAdviseesPermissions.ts */

export interface IAdviseesPermissions {
    allStudentsFacultyDossier: boolean;
    alumniFacultyDossier: boolean;
    myAdvisees: boolean;
    myStudents: boolean;
    myAssociations: boolean;
    allStudents: boolean;
    formerAdvisees: boolean;
    formerAdviseesFacultyDossier: boolean;
    alumni: boolean;
    myAdviseesFacultyDossier: boolean;
    myAssociationsFacultyDossier: boolean;
    myDepartment: boolean;
    myDepartmentFacultyDossier: boolean;
    myCampus: boolean;
    myCampusFacultyDossier: boolean;
    mySharedAdvisees: boolean;    
    myStudentsFacultyDossier: boolean;
    download: boolean;
    authorizeRegistration: boolean;
    shareAdvisees: boolean;
    emailSelected: boolean;
}