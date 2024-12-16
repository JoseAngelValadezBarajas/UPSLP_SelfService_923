/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IInstructorSetupResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

export interface IInstructorSetupResources extends ILayoutResources {
    lblEmptyState: string;
    lblHeaderTitle: string;
    lblPageTitle: string;
    instructorSetupTabs: IInstructorSetupTabsResources;
}

export interface IInstructorSetupTabsResources {
    lblAdvisorWarnings: string;
    lblAssociationHead: string;
    lblCampusCoordinator: string;
    lblDepartmentHead: string;
    lblFacultyPages: string;
    lblOffices: string;
}