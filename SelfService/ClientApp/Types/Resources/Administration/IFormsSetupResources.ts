/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IFormsSetupResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

export interface IFormsSetupResources extends ILayoutResources {
    lblEmptyState: string;
    lblHeaderTitle: string;
    lblPageTitle: string;
    formsSetupTabs: IFormsSetupTabsResources;
}

export interface IFormsSetupTabsResources {
    lblApplicationFormSetup: string;
    lblInquiryFormSetup: string;
}