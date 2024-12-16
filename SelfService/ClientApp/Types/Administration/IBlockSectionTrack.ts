/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IBlockSectionTrack.ts */

import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';

export interface IBlockSectionTrack {
    section: ISection;
    // UI
    isAdded: boolean;
    isDeleted: boolean;
    isSaved: boolean;
}