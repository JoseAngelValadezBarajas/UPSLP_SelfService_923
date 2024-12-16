/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IDemographicOptions.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface IDemographicOptions {
    countries: IDropDownOption[];
    ethnicities: IDropDownOption[];
    genders: IDropDownOption[];
    languages: IDropDownOption[];
    maritalStatus: IDropDownOption[];
    religions: IDropDownOption[];
    veteranStatus: IDropDownOption[];
    visas: IDropDownOption[];
}