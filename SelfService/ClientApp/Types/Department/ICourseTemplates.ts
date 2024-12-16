/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ICourseTemplates.ts */

import { ICourseTemplatesSettings } from './ICourseTemplatesSettings';

export interface ICourseTemplates {
    courseTemplates: ICourseTemplatesSettings[];
    overallCount: number;
    length?: number;
    startIndex?: number;
}