/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IAcademicSchedule.ts */

import { IYearTermSession } from '../Generic/IYearTerm';
import { IFacultyCourses } from './IFacultyCourses';

export interface IAcademicSchedule {
    isConEd: boolean;
    period: IYearTermSession;
    sessionDescription: string;
    courses: IFacultyCourses[];
}