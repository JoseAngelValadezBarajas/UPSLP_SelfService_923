/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IAcademicDegReq.ts */

import { IAcademicPlanProgram } from './IAcademicPlanProgram';

export interface IAcademicDegReq {
    id: number;
    year: string;
    termCode: string;
    termDesc: string;
    programs: IAcademicPlanProgram[];
}