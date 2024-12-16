/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IWebsiteSetupPermissions.ts */

export interface IWebsiteSetupPermissions {
    emailProvider: boolean;
    nameFormatCategories: boolean;
    nameFormats: boolean;
    paymentProvider: boolean;
    permissionStore: boolean;
    siteSettings: boolean;
    systemFormats: boolean;
    systemInformation: boolean;
    theme: boolean;
    reCaptcha: boolean;
    courseMaterials: boolean;
}

export enum WebsiteSetupTabs {
    SystemInformation = 0,
    Theme = 1,
    SystemFormats = 2,
    NameFormats = 3,
    NameFormatCategories = 4,
    PaymentProvider = 5,
    EmailProvider = 6,
    PermissionStore = 7,
    SiteSettings = 8,
    ReCaptcha = 9,
    CourseMaterials = 10
}