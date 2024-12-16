/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IWaitlist.ts */

// Types
import { IEmailSettings } from '../InstitutionSettings/IEmailSettings';
import { ISectionList } from './ISectionList';
import { IStudentWaitlist } from './IStudentWaitlist';

export interface IWaitlist extends ISectionList {
    allowSave: boolean;
    emailSettings: IEmailSettings;
    students: IStudentWaitlist[];
}