/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAppSetupForm.ts */

// Types
import { IFieldsGroupSetup } from './IFieldsGroupSetup';
import { IStepSetup } from './IStepSetup';

export interface IAppSetupForm {
    description: string;
    fieldsGroups?: IFieldsGroupSetup[];
    formLayoutId: number;
    name: string;
    steps?: IStepSetup[];
}