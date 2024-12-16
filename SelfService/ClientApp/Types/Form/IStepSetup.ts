/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IStepSetup.ts */

// Types
import { IFieldsGroupSetup } from './IFieldsGroupSetup';

export interface IStepSetup {
    stepFieldGroups: IFieldsGroupSetup[];
    stepInstructions: string;
    stepNumber: number;
    stepTitle: string;
}