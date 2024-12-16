/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ISectionCourseManagement.ts */

import { IYearTermSession } from '../Generic/IYearTerm';

export interface ISectionCourseManagement {
    departmentId?: number;
    facultyId?: number;
    period?: IYearTermSession;
    sectionId?: number;
    sessionPeriodId?: number;
    year?: string;
}