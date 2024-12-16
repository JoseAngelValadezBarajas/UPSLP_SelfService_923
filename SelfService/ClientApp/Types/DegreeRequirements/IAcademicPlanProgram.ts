/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IAcademicPlanProgram.ts */

import { IAcademicPlanDegree } from './IAcademicPlanDegree';

export interface IAcademicPlanProgram {
    id: number;
    programCode: string;
    programDesc: string;
    degrees: IAcademicPlanDegree[];
}