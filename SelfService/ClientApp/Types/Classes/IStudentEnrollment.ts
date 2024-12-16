/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: IStudentEnrollment.ts */

// Types
import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { IStudentAcademicRecord } from './IStudentAcademicRecord';

export interface IStudentEnrollment extends IAvatar {
    hasPicture: boolean;
    peopleId: string;
    emailAddress: string;
    credits: string;
    statusCode: string;
    studentAcademicRecords: IStudentAcademicRecord[];
    withdrawn: boolean;
    // UI
    checked: boolean;
}