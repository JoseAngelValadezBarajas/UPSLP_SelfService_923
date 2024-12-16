/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAcademic.ts */

import { IPerson } from './IPerson';

export interface IAcademic {
    advisor: IPerson;
    campus: string;
    classLevel: string;
    college: string;
    collegeAttend: string;
    curriculum: string;
    degree: string;
    department: string;
    expectedGraduation: string;
    fullPart: string;
    graduationSession: string;
    graduationStatus: string;
    graduationTerm: string;
    graduationYear: string;
    historicalGpa: IAcademicGpa[];
    matriculationDate: boolean;
    matriculationPeriod: string;
    nonTradProgram: string;
    population: string;
    program: string;
    rating: string;
    term: string;
    termCreditLimit: string;
    transcriptSequence: string;
    year: string;
}

export interface IAcademicGpa {
    gpa: string;
    yearTerm: string;
}