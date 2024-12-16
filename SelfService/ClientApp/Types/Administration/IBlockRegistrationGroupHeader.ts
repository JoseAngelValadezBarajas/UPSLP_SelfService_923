/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IBlockRegistrationGroupHeader.ts */

import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';

export interface IBlockRegistrationGroupHeader {
    blockRegistrationGroupId: number;
    createDateTime: string;
    isActive: boolean;
    name: string;
    numberOfSections: number;
    revisionDateTime: string;
    sectionIdList: number[];
    // UI
    expanded?: boolean;
    expandedDetails?: boolean;
    hasTimeConflict?: boolean;
    isLoadingDetail?: boolean;
    isLoadingWarning?: boolean;
    sectionList?: ISection[];
}

export interface IBlockRegistrationGroupHeaders {
    blockRegistrationGroupHeaderList: IBlockRegistrationGroupHeader[];
    overallCount: number;
}