/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IStudentWaitlist.ts */

// Types
import { IStudentEnrollment } from './IStudentEnrollment';

export interface IStudentWaitlist extends IStudentEnrollment {
    dateAdded: string | undefined;
    creditType: string | undefined;
    rank: string | undefined;
    attempts: string | undefined;
    isEditable: boolean;
}