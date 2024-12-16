/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IApplicationActivity.ts */
export interface IApplicationActivity {
    applicationId?: number;
    activityType?: number;
    activity?: number;
    position?: number;
    hoursPerWeek?: number;
    weeksPerYear?: number;
    numberOfYears?: number;
    participatedGrade09?: boolean;
    participatedGrade10?: boolean;
    participatedGrade11?: boolean;
    participatedGrade12?: boolean;
    participatedPostsecondary?: boolean;
}