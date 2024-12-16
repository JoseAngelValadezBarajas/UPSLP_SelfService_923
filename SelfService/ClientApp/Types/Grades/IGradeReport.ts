/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IGradeReport.ts */

export interface IGradeReport {
    awardsTerm: string | undefined;
    awardsOverall: string | undefined;
    courses: IGradeReport[];
    courseComments: string;
    credits: string | undefined;
    creditsAttempted: string | undefined;
    creditTypeDesc: string | undefined;
    creditsEarned: string | undefined;
    eventId: string | undefined;
    eventTypeDesc: string | undefined;
    finalGrade: string | undefined;
    finalGradeComments: string;
    gpaOverall: string | undefined;
    gradeReport: string | undefined;
    gpaTerm: string | undefined;
    midtermGrade: string | undefined;
    midGradeComments: string;
    name: string | undefined;
    period: string | undefined;
    projectedGrade: string | undefined;
    projectedGradePercentage: string | undefined;
    qualityPoints: string | undefined;
    section: string | undefined;
    sectionId: number;
    sequenceNumber: string | undefined;
    sequenceDrop: string | undefined;
    sessions: IGradeReport[];
    sessionDesc: string | undefined;
    subType: string | undefined;
}