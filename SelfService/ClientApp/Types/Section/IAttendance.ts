/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IAttendance.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../InstitutionSettings/IEmailSettings';
import { IAttendanceStudentList } from './IAttendanceStudentList';

export interface IAttendance {
    attendStatusCodes: IDropDownOption[];
    emailSettings: IEmailSettings;
    studentList: IAttendanceStudentList[];
}