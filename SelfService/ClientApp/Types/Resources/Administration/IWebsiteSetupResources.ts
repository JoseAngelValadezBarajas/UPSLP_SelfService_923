/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IWebsiteSetupResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

export interface IWebsiteSetupResources extends ILayoutResources {
    lblEmptyState: string;
    lblHeaderTitle: string;
    lblPageTitle: string;
    websiteSetupTabs: IWebsiteSetupTabsResources;
}

export interface IWebsiteSetupTabsResources {
    lblCourseMaterials: string;
    lblEmailProvider: string;
    lblGlobalSettings: string;
    lblNameFormatCategories: string;
    lblNameFormats: string;
    lblPaymentProvider: string;
    lblPermissionStore: string;
    lblReCaptcha: string;
    lblSiteSettings: string;
    lblSystemInformation: string;
    lblTheme: string;
}