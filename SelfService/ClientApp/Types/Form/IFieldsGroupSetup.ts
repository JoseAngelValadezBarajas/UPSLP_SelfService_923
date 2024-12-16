/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IFieldsGroupSetup.ts */

import { IFieldSetup } from './IFieldSetup';
import { IValidatorMessage } from './IValidatorMessage';

export interface IFieldsGroupSetup {
    fields: IFieldSetup[];
    id: string;
    instructions: string;
    label: string;
    sortOrder: number;
    validatorMessages: IValidatorMessage[];
    maximumAllowed: number;
    isCustom: boolean;
}