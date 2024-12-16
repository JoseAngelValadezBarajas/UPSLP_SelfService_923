/* Copyright 2018 - 2020 Ellucian Company L.P. and its affiliates.
 * File: IFacultySchedule.ts */

import { IAcademicSchedule } from './IAcademicSchedule';

export interface IFacultyScheduleCourses {
    conEdCourses: IAcademicSchedule[];
    tradCourses: IAcademicSchedule[];
}