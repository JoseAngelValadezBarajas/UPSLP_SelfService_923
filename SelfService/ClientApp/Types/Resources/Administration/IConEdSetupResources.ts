/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IConEdSetupResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

export interface IConEdSetupResources extends ILayoutResources {
    lblEmptyState: string;
    lblHeaderTitle: string;
    lblPageTitle: string;
    conEdSetupTabs: IConEdSetupTabsResources;
}

export interface IConEdSetupTabsResources {
    lblConEdDefaults: string;
    lblConEdRegistration: string;
}