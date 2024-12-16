/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IFacultyCourses.ts */

export interface IFacultyCourses {
    sectionId: number;
    description: string;
    credits: string;
    creditType: string;
    courseSchedules: string[];
    courseIntructors: string[];
}