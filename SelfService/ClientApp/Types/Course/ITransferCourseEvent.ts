/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: ITransferCourseEvent.ts */

export interface ITransferCourseEvent {
    eventDesc: string;
    eventId: string;
    id: string;
    minGrade: string;
    minimumCredits?: number;
    name: string;
    overallCount: number;
}