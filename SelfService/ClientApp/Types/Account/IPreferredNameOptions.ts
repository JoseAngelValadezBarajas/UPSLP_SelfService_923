/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPreferredNameOptions.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface IPreferredNameOptions {
    genderIdentities: IDropDownOption[];
    pronouns: IDropDownOption[];
}