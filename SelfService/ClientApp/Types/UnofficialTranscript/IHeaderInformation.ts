/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IHeaderInformation.ts */

import { ITotalCredits } from './ITotalCredits';
import { ITranscriptDegree } from './ITranscriptDegree';
import { ITranscriptYearTerm } from './ITranscriptYearTerm';

export interface IHeaderInformation {
    orgName: string;
    houseNumber: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    addressLine5: string;
    fullName: string;
    governmentId: string;
    birthDate: string;
    transcriptDegree: ITranscriptDegree[];
    honors: string;
    cumGpa: string;
    previousInstitutions: string[];
    transcriptYearTerm: ITranscriptYearTerm[];
    transcriptNotes: string[];
    totalCredits: ITotalCredits;
}