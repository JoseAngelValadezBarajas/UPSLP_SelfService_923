/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IFacultyAssistants.ts */

import { IEmailSettings } from '../InstitutionSettings/IEmailSettings';
import { IFacultyAssistantDetail } from './IFacultyAssistant';

export interface IFacultyAssistants {
    emailSettings: IEmailSettings;
    facultyAssistants: IFacultyAssistantDetail[];
}