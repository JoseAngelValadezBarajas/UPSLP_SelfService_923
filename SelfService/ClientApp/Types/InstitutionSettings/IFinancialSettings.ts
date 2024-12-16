/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IFinancialSettings.ts */

export interface IFinancialSettings {
    cashReceiptCode: number;
    cashReceiptOffice: number;
    displayDueDate: boolean;
    displayOverallBalance: boolean;
    displayUnmetNeeds: boolean;
    displayWashoutTransactions: boolean;
    enableOnlinePayment: boolean;
    includeAnticipatedAid: boolean;
    // UI validations
    cashReceiptCodeModified: boolean;
    cashReceiptOfficeModified: boolean;
    enableOnlinePaymentIsValid: boolean;
    paymentPeriodsModified: boolean;
}