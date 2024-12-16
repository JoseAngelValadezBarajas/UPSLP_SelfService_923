/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IStudentClassList.ts */

// Types
import { IStudentEnrollment } from './IStudentEnrollment';

export interface IStudentClassList extends IStudentEnrollment {
    creditType: string;
    attendance: string;
}