/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPeopleTestScores.ts */

import { IPeopleTestScoreTypes } from './IPeopleTestScoreTypes';

export interface IPeopleTestScores {
    description: string;
    isAlpha: boolean;
    testScoreTypes: IPeopleTestScoreTypes[];
}