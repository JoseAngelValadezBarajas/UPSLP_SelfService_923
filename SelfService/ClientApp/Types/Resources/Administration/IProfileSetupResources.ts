/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IProfileSetupResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

export interface IProfileSetupResources extends ILayoutResources {
    lblEmptyState: string;
    lblHeaderTitle: string;
    lblPageTitle: string;
    profileSetupTabs: IProfileSetupTabsResources;
}

export interface IProfileSetupTabsResources {
    lblAddressSettings: string;
    lblDemographicSettings: string;
    lblEmergencyContactSettings: string;
    lblPhoneNumberSettings: string;
    lblPreferredNameSettings: string;
}