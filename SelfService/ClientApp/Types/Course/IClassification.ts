/* Copyright 2018 - 2020 Ellucian Company L.P. and its affiliates.
 * File: IClassification.ts */

import { ICourseEvent } from './ICourseEvent';

export interface IClassification {
    id: number;
    description: string;
    creditMin: string;
    creditMax: string;
    creditsCompleted: string;
    creditsCompletedValue: number;
    creditsRemaining: string;
    creditsTaken: string;
    courseEventList: ICourseEvent[];
    // UI
    expanded: boolean;
}