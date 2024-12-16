/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IDataForm.ts */

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IComplexItem } from './IComplexItem';

export interface IDataForm {
    allowMultipleSelection?: boolean;
    complexOptions?: IComplexItem[];
    error?: boolean;
    errorMessageDuplicate?: string;
    errorMessageFormat?: string;
    errorMessageNotValid?: string;
    errorMessageNumeric?: string;
    errorMessagePrimary?: string;
    errorMessageRange?: string;
    errorMessageRequired?: string;
    helperText?: string;
    id: string;
    label?: string;
    modified?: boolean;
    options?: IDropDownOption[];
    section?: number;
}