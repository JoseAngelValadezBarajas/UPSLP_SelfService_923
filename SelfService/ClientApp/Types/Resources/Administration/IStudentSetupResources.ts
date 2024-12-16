/* Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
 * File: IStudentSetupResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

export interface IStudentSetupResources extends ILayoutResources {
    lblEmptyState: string;
    lblHeaderTitle: string;
    lblPageTitle: string;
    studentSetupTabs: IStudentSetupTabsResources;
}

export interface IStudentSetupTabsResources {
    lblAgreements: string;
    lblBlockRegistration: string;
    lblFinancialSettings: string;
    lblGradeMappings: string;
    lblRegistrationGroups: string;
    lblSettings1098T: string;
    lblSharedAccess: string;
    lblStudentRecords: string;
    lblTraditionalDefaults: string;
    lblTraditionalRegistration: string;
    lblTranscriptRequest: string;
}