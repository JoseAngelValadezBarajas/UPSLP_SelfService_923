/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IComplexItem.ts */

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface IComplexItem {
    description: string;
    options?: IDropDownOption[];
    value: string | number;
}