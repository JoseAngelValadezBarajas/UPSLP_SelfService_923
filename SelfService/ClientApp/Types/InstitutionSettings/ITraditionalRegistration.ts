/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ITraditionalRegistration.ts */

export interface ITraditionalRegistration {
    agreementId: number;
    allowChangeOfCreditType: boolean;
    allowDrops: boolean;
    assessmentType: string;
    cashReceiptCode: number;
    cashReceiptOffice: number;
    enableAssessment: boolean;
    enableAssessmentAfterApproval: boolean;
    enableBlockRegistration: boolean;
    enableInstructorPermissionRequest: boolean;
    enableOnlinePayment: boolean;
    enableRegisterForPendingCourses: boolean;
    enableStudentAgreement: boolean;
    enableWaitList: boolean;
    holdForAdvisorApproval: boolean;
    requireOnlinePayment: boolean;
    statementType: string;
    validateClassAvailability: boolean;
    validateCorequisites: boolean;
    validateCreditLimit: boolean;
    validateCrosstally: boolean;
    validatePrerequisites: boolean;
    validateStopList: boolean;
    validateTimeConflicts: boolean;
    // UI validations
    agreementIdModified: boolean;
    cashReceiptCodeModified: boolean;
    cashReceiptOfficeModified: boolean;
    enableOnlinePaymentIsValid: boolean;
}