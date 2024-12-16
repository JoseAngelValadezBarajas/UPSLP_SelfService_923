/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ICourseTemplatesAssignCourses.ts */

import { ICourseTemplatesSectionAssignments } from './ICourseTemplatesSectionAssignments';

export interface ICourseTemplatesAssignCourses {
    sectionAssignments: ICourseTemplatesSectionAssignments[];
    overallCount: number;
}