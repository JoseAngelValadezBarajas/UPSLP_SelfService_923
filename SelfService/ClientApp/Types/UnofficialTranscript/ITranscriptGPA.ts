/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ITranscriptGpa.ts */

export interface ITranscriptGpa {
    gpaType: string;
    attemptedCredits: string;
    earnedCredits: string;
    totalCredits: string;
    gpaCredits: string;
    transferCredits: string;
    qualityPoints: string;
    gpa: string;
    classRank: number;
    classSize: number;
}