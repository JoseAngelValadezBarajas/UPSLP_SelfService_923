/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IGradeReportOption.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface IGradeReportOption {
    period: IDropDownOption[];
    sequence: IDropDownOption[];
}