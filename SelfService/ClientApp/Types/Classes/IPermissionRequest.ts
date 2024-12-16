/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IPermissionRequest.ts */

// Types
import { IEmailSettings } from '../InstitutionSettings/IEmailSettings';
import { ISectionList } from './ISectionList';
import { IStudentPermissionRequest } from './IStudentPermissionRequest';

export interface IPermissionRequest extends ISectionList {
    emailSettings: IEmailSettings;
    modified: boolean;
    prerequisites: string;
    students: IStudentPermissionRequest[];
}