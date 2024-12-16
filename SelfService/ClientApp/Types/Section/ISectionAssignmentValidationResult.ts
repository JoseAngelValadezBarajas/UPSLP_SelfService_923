/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: ISectionAssignmentValidationResult.ts */

import { ISectionAssignmentErrors } from './ISectionAssignmentErrors';

export interface ISectionAssignmentValidationResult {
    errors: ISectionAssignmentErrors[];
    status: number;
}