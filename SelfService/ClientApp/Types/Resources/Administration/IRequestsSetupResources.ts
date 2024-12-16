/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IRequestsSetupResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

export interface IRequestsSetupResources extends ILayoutResources {
    lblEmptyState: string;
    lblHeaderTitle: string;
    lblPageTitle: string;
    requestsSetupTabs: IRequestsSetupTabsResources;
}

export interface IRequestsSetupTabsResources {
    lblAddressRequests: string;
    lblDemographicRequests: string;
    lblPreferredNameRequests: string;
}