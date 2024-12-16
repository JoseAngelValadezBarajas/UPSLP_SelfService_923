/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAddressOptions.ts */

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface IAddressOptions {
    addressTypes: IDropDownOption[];
    countries: IDropDownOption[];
    recurAnually: boolean;
    states: IDropDownOption[];
}