/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IUnofficialTranscript.ts */

import { IHeaderInformation } from './IHeaderInformation';
import { ITranscriptTestScore } from './ITranscriptTestScore';

export interface IUnofficialTranscript {
    showAlternateGrade: boolean;
    showLegend: boolean;
    legend: string;
    showClassInformation: boolean;
    showFiceCode: boolean;
    showGovernmentId: boolean;
    showDateOfBirth: boolean;
    showTotalsAtEnd: boolean;
    headerInformation: IHeaderInformation[];
    testScores: ITranscriptTestScore[];
}