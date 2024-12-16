/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ITranscriptOrganization.ts */

import { ITranscriptCourses } from './ITranscriptCourses';

export interface ITranscriptOrganization {
    organizationName: string;
    transcriptCourses: ITranscriptCourses[];
}