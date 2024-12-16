/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IStudentDegReq.ts */

import { ICourseEvent } from '../Course/ICourseEvent';
import { IDiscipline } from '../Course/IDiscipline';

export interface IStudentDegReq {
    coursesMax: string;
    coursesMin: string;
    creditsCompleted: string;
    creditsCompletedValue: number;
    creditsMax: string;
    creditMin: string;
    creditsRemaining: string;
    creditsTaken: string;
    curriculumDesc: string;
    curriculumCode: string;
    degreeCode: string;
    degreeDesc: string;
    degreeGpa: string;
    discipline: number;
    disciplineList: IDiscipline[];
    expectedGraduationDate: string;
    formalTitle: string;
    id: number;
    overallGpa: string;
    matricYear: string;
    matricTerm: string;
    percentageCourses: string;
    percentageDisciplines: string;
    programDesc: string;
    programCode: string;
    programOfStudyId: number;
    sectionsNotCounted: ICourseEvent[];
    termCode: string;
}