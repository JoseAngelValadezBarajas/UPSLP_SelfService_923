/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ISectionAssignmentsSetup.ts */

import { IActivitiesSetup } from './IActivitiesSetup';
import { ISectionAssignmentValidationResult } from './ISectionAssignmentValidationResult';

export interface ISectionAssignmentsSetup {
    isRestricted: boolean;
    sectionAssignmentSetup: IActivitiesSetup;
    sectionAssignmentValidationResult: ISectionAssignmentValidationResult;
}