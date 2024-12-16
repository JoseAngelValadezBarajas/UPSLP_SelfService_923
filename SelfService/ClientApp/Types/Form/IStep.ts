/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IStep.ts */

// Types
import { IFieldsGroup } from './IFieldsGroup';

export interface IStep {
    title: string;
    instructions: string;
    fieldsGroups: IFieldsGroup[];
}