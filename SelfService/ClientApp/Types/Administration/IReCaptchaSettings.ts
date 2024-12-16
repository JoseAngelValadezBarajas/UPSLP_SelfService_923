/* Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IReCaptchaSettings.ts */

export interface IReCaptchaSettings {
    enableCreateAccount: boolean;
    enableForgotPassword: boolean;
    enableSubmitApplication: boolean;
    enableSubmitInquiry: boolean;
    enableMakePayment: boolean;
    googleEndpoint: string;
    secretKey: string;
    siteKey: string;

    // UI
    isEnableCreateAccountLoading?: boolean;
    isEnableForgotPasswordLoading?: boolean;
    isEnableSubmitApplicationLoading?: boolean;
    isEnableSubmitInquiryLoading?: boolean;
    isEnableMakePaymentLoading?: boolean;
    secretKeyModified?: boolean;
    siteKeyModified?: boolean;
}
