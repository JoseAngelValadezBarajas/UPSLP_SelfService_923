/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IProfileMain.ts */

import { IAcademic } from './IAcademic';
import { IEmailSettings } from '../InstitutionSettings/IEmailSettings';
import { IPerson } from './IPerson';

export interface IProfileMain {
    academic: IAcademic;
    curriculumGpa: string;
    emailSettings: IEmailSettings;
    enrolledCredits: string;
    hasProgramPicture: boolean;
    overallGpa: string;
    person: IPerson;
    programFormalTitle: string;
    programId: string;
    remainingCredits: string;
    termAttemptedCredits: string;
    termEarnedCredits: string;
}