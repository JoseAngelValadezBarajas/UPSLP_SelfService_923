/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ICourseStatisticsList.ts */

export interface ICourseStatisticsList {
    averageScore: string;
    highScore: string;
    isMidterm: boolean;
    lowScore: string;
    midtermGrades: boolean;
    percentIncluded: string;
    standardDeviation: string;
    variance: string;
    sectionStatistic: ICourseStatisticsList[];
    studentCount: number;
}