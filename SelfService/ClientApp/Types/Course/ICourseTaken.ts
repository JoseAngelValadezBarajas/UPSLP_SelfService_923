/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ICourseTaken.ts */

export interface ICourseTaken {
    credits: string;
    eventId: string;
    eventName: string;
    finalGrade: string;
    section: string;
    session: string;
    status: string;
    subType: string;
    yearTerm: string;
}