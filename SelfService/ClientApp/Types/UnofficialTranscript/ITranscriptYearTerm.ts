/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ITranscriptYearTerm.ts */

import { ITranscriptGpa } from './ITranscriptGpa';
import { ITranscriptOrganization } from './ITranscriptOrganization';

export interface ITranscriptYearTerm {
    period: string;
    transcriptOrganization: ITranscriptOrganization[];
    yearTermAwards: string[];
    transcriptGpa: ITranscriptGpa[];
    yearTermNotes: string[];
}