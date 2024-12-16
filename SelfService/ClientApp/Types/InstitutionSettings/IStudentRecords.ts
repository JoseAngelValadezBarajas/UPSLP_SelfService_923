/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IStudentRecords.ts */

export interface IStudentRecords {
    allowStudentOnStopList: boolean;
    displayInstitutionAddress: boolean;
    displayInstitutionName: boolean;
    displayMidSessionGrades: boolean;
    legend: string;
    maximumNumberPlans: number | string;
    showAlternateGrade: boolean;
    showClassInformation: boolean;
    showCoursesInProgress: boolean;
    showDateOfBirth: boolean;
    showDatesForTerms: boolean;
    showFiceCode: boolean;
    showGovernmentId: boolean;
    showLegend: boolean;
    showSequence: boolean;
    showStudentPicture: boolean;
    showTotalsAtEnd: boolean;
    // UI
    errorMaximumNumberPlans: boolean;
}