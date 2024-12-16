/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ISectionSearch.ts */

import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';

export interface ISectionSearch {
    enableCart: boolean;
    period: string;
    sections: ISection[];
}