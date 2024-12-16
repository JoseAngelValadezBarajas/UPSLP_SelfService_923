/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IGradeMapping.ts */

// External Types
import { ISectionGradeMapping } from '../../Types/Section/ISectionGradeMapping';

export interface IGradeMapping {
    creditTypeId: number;
    creditType: string;
    sectionList: ISectionGradeMapping[];
    // UI
    modified: boolean;
    loading: boolean;
}