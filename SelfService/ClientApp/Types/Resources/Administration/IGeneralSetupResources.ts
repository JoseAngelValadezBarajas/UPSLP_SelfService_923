/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IGeneralSetupResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

export interface IGeneralSetupResources extends ILayoutResources {
    lblEmptyState: string;
    lblHeaderTitle: string;
    lblPageTitle: string;
    generalSetupTabs: IGeneralSetupTabsResources;
}

export interface IGeneralSetupTabsResources {
    lblDashboardMessages: string;
    lblPeriodFilters: string;
    lblDossier: string;
    lblChecklist: string;
}