/* Copyright 2018 - 2020 Ellucian Company L.P. and its affiliates.
 * File: IDiscipline.ts */

import { IClassification } from './IClassification';

export interface IDiscipline {
    id: number;
    studentDegreeRequirementId: number;
    description: string;
    creditMax: string;
    creditMin: string;
    creditsCompleted: string;
    creditsCompletedValue: number;
    creditsRemaining: string;
    creditsTaken: string;
    classificationList: IClassification[];
    // UI
    expanded: boolean;
}