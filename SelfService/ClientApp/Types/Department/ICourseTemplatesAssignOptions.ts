/* Copyright 2019 Ellucian Company L.P. and its affiliates.
  * File: ICourseTemplatesAssignOptions.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface ICourseTemplatesAssignOptions {
    classLevels: IDropDownOption[];
    departments: IDropDownOption[];
    subtypes: IDropDownOption[];
}