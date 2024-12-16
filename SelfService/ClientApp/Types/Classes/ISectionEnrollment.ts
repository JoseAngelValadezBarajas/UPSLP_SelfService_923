/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ISectionEnrollment.ts */

// Types
import { IEmailSettings } from '../InstitutionSettings/IEmailSettings';
import { ISectionList } from './ISectionList';
import { IStudentClassList } from './IStudentClassList';

export interface ISectionEnrollment extends ISectionList {
    emailSettings: IEmailSettings;
    students: IStudentClassList[];
}