/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: ISectionCopyActivities.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface ISectionCopyActivities {
    defaultPeriod: IDropDownOption;
    defaultSection: IDropDownOption;
    periods: IDropDownOption[];
    sections: IDropDownOption[];
}