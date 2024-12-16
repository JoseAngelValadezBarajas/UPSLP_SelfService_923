/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ISectionMapping.ts */

// External Types
import { IGradeMapping } from '../../Types/Section/IGradeMapping';

export interface ISectionMapping {
    finalPoint: number | null;
    midTermPoint: number | null;
    showMidTerm: boolean;
    gradeMappingList: IGradeMapping[];
}