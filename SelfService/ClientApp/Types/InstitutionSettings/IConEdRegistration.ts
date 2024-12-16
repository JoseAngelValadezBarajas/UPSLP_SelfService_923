/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IConEdRegistration.ts */

export interface IConEdRegistration {
    agreementId: number;
    allowChangeOfCreditType: boolean;
    allowDrops: boolean;
    assessmentType: string;
    cashReceiptCode: number;
    cashReceiptOffice: number;
    defaultConEdStudentRole: number;
    defaultEmailType: number;
    dropTimeLimit: string;
    dropTimeLimitOption: ConEdOptionDate;
    enableInstructorPermissionRequest: boolean;
    enableOnlinePayment: boolean;
    enableRegisterForPendingCourses: boolean;
    enableStudentAgreement: boolean;
    enableTransactionRollback: boolean;
    enableWaitList: boolean;
    expirationIncrement: string;
    expirationMaxDuration: string;
    fileExtension: string;
    includeUncategorizedSources: boolean;
    location: string;
    registrationEndPeriod: string;
    registrationEndPeriodOption: ConEdOptionDate;
    registrationStartPeriod: string;
    requireOnlinePayment: boolean;
    showCoursePicture: boolean;
    statementType: string;
    useTransactionChargesOnly: boolean;
    validateClassAvailability: boolean;
    validateCorequisites: boolean;
    validateCreditLimit: boolean;
    validateCrosstally: boolean;
    validatePrerequisites: boolean;
    validateStopList: boolean;
    validateTimeConflicts: boolean;
    // UI validations
    // agreementIdModified: boolean;
    cashReceiptCodeModified: boolean;
    cashReceiptOfficeModified: boolean;
    defaultConEdStudentRoleModified: boolean;
    defaultEmailTypeModified: boolean;
    dropTimeLimitInvalid: boolean;
    dropTimeLimitModified: boolean;
    enableOnlinePaymentIsValid: boolean;
    expirationIncrementInvalid: boolean;
    expirationIncrementModified: boolean;
    expirationMaxDurationInvalid: boolean;
    expirationMaxDurationLessThan: boolean;
    expirationMaxDurationModified: boolean;
    fileExtensionModified: boolean;
    locationModified: boolean;
    registrationEndPeriodInvalid: boolean;
    registrationEndPeriodModified: boolean;
    registrationStartPeriodInvalid: boolean;
    registrationStartPeriodModified: boolean;
}

export enum ConEdOptionDate {
    BeforeStartDate = 1,
    AfterStartDate = 2
}