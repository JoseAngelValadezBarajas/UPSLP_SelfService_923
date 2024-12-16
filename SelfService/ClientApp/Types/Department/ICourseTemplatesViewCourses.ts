/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ICourseTemplatesViewCourses.ts */

import { ICourseTemplatesAssignmentSections } from './ICourseTemplatesAssignmentSections';

export interface ICourseTemplatesViewCourses {
    assignmentSections: ICourseTemplatesAssignmentSections[];
    overallCount: number;
}