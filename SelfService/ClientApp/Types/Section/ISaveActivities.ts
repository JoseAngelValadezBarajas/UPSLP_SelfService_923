/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ISaveActivities.ts */

import { IAssignmentTypes } from './IAssignmentTypes';

export interface ISaveActivities {
    assignmentTypes?: IAssignmentTypes[];
    sectionId?: number;
}