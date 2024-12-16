/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IFieldGroup.ts */

// Types
import { IFieldForm } from './IFieldForm';

export interface IFieldsGroup {
    id: string;
    label: string;
    instructions: string;
    fields: IFieldForm[];
    isCustom?: boolean;
    isExpansionPanel: boolean;
    isMultiple: boolean;
    isHorizontalAligned: boolean;
    isRequired: boolean;
    isDisableButton?: boolean;
    errorMessageRequired: string;
    errorMessageDuplicate: string;
    errorMessageNotValid: string;
    errorMessageFormat: string;
    errorMessagePrimary: string;
    errorMessageNumeric: string;
    errorMessageRange: string;
    maximumAllowed?: number;
}