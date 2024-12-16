/* Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
 * File: IStudentSetupPermissions.ts */

export interface IStudentSetupPermissions {
    agreements: boolean;
    blockRegistration: boolean;
    financialSettings: boolean;
    gradeMappings: boolean;
    registrationGroups: boolean;
    settings1098T: boolean;
    sharedAccess: boolean;
    studentRecords: boolean;
    traditionalDefaults: boolean;
    traditionalRegistration: boolean;
    transcriptRequest: boolean;
}

export enum StudentSetupTabs {
    StudentRecords = 0,
    Agreements = 1,
    RegistrationGroups = 2,
    TraditionalRegistration = 3,
    TraditionalDefaults = 4,
    BlockRegistration = 5,
    FinancialSettings = 6,
    TranscriptRequest = 7,
    GradeMappings = 8,
    Settings1098T = 9,
    SharedAccess = 10
}